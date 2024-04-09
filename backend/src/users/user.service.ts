import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { buildImagePath, deleteImage } from '../utils';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../casl/permissions/action';
import { Role } from './user-roles';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * Create a user with the given data.
   * @param registerUserDto sent by the client.
   */
  public async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser: User = this.userRepository.create(registerUserDto);
    await newUser.save();
    return newUser;
  }

  /**
   * Update user by a given id.
   * @param requestingUser that has sent the request.
   * @param userId of the requested entity that should be updated.
   * @param updateUserDto sent by the client.
   */
  async updateUserById(requestingUser: User, userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user with id exists
    const user: User = await this.findOne(userId);
    await this.throwUnlessCan(requestingUser, Action.Update, user);

    const updatedUser: User = Object.assign(user, updateUserDto);
    await updatedUser.save();
    return updatedUser;
  }

  /**
   * Find a user by their email.
   * @param email that is associated with the user.
   */
  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  /**
   * Find a user by their id.
   * @param requestingUser that has sent the request.
   * @param userId of the user that should be searched for.
   */
  async findUserById(requestingUser: User, userId: number): Promise<User> {
    const user = await this.findOne(userId);
    await this.throwUnlessCan(requestingUser, Action.Read, user);
    return user;
  }

  /**
   * Find a user by their id.
   * @param userId of the user that should be searched for.
   */
  async findOne(userId: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Find all users.
   */
  async findAll(requestingUser: User): Promise<User[]> {
    await this.throwUnlessCan(requestingUser, Action.Read);
    return await this.userRepository.find();
  }

  /**
   * Remove a user by their id.
   * @param requestingUser that has sent the request.
   * @param userId of the user that should be deleted.
   */
  async deleteUserById(requestingUser: User, userId: number): Promise<number> {
    const user = await this.findOne(userId);
    await this.throwUnlessCan(requestingUser, Action.Delete, user);
    await this.deleteUserImage(user);
    return (await this.userRepository.delete(userId)).affected;
  }

  /**
   * Update a specific user image by their id. Delete the previous one if available.
   * @param requestingUser that has sent the request.
   * @param userId of the user which image should be updated.
   * @param file that should be saved.
   */
  async updateUserImageById(requestingUser: User, userId: number, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(userId);
    await this.throwUnlessCan(requestingUser, Action.Update, user);

    // Remove previous avatar from files and database, if it exists
    if (user.profileImagePath) {
      await deleteImage(user.profileImagePath);
    }

    const updatedUser: User = Object.assign(user, {
      profileImagePath: buildImagePath(file.path),
    });
    await updatedUser.save();
    return updatedUser;
  }

  /**
   * Delete image of a user by their id.
   * @param requestingUser that has sent the request.
   * @param userId of the user which image should be deleted.
   */
  async deleteUserImageById(requestingUser: User, userId: number): Promise<void> {
    const user = await this.findOne(userId);
    await this.throwUnlessCan(requestingUser, Action.Delete, user);
    await this.deleteUserImage(user);
  }

  /**
   * Delete image of a user if it exists.
   * @param user of which the image should be deleted.
   */
  async deleteUserImage(user: User): Promise<void> {
    if (user.profileImagePath) {
      await deleteImage(user.profileImagePath);
      const updatedUser: User = Object.assign(user, {
        profileImagePath: null,
      });
      await updatedUser.save();
    }
  }

  /**
   * Check if the user that is requesting a user endpoint can access it.
   * @param requestingUser that is sending the request (Identified by token)
   * @param action of any CRUD operation.
   * @param changingUser that is getting updated/deleted/read (From :id endpoints only)
   * @private
   */
  private async throwUnlessCan(requestingUser: User, action: Action, changingUser?: User): Promise<void> {
    const ability = this.abilityFactory.createForUser(requestingUser);
    const canAccess = ability.can(action, changingUser ? changingUser : User);
    if (!canAccess || (!changingUser && requestingUser.role == Role.User)) {
      throw new ForbiddenException('Forbidden resource. You do not have permission to access the data.');
    }
  }
}
