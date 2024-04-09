import { Test, TestingModule } from '@nestjs/testing';
import {
  updateUserStub,
  adminStub,
  registerAdminStub,
  expectedUserStub,
  registerTestUserStub,
} from '../mockdata/stubs/user-stub';
import { UpdateUserDto } from '../../src/users/dto';
import { User } from '../../src/users/entity/user.entity';
import { UserService } from '../../src/users/user.service';
import { AppModule } from '../../src/app.module';
import { bcryptHelper } from '../../src/utils';
import { DataSource, EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRegisterUserDto } from '../mockdata/mockdto/mock-register-user.dto';
import { clearDatabase, seedDatabase } from '../utils/test.utils';
import { RegisterUserDto } from '../../src/auth/dto';
import { Role } from '../../src/users/user-roles';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  const userStubObject: User = adminStub();
  const registerUserObject: MockRegisterUserDto = registerAdminStub();
  const updateUserStubObject: UpdateUserDto = updateUserStub();
  const expectedUser: User = expectedUserStub();

  const registerUserTestObject: RegisterUserDto = registerTestUserStub();

  const nonExistentUserId = 99;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    dataSource = module.get<DataSource>(DataSource);

    await seedDatabase(dataSource);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  /**
   * Check defined services and repositories.
   */
  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  /**
   * Create a user.
   */
  describe('create a user', () => {
    it('should create a user with a hashed password', async () => {
      jest.spyOn(bcryptHelper, 'hashPassword').mockReturnValue(`hashed${registerUserTestObject.password}`);

      const createdUser: User = await userService.createUser(registerUserTestObject);
      expect(bcryptHelper.hashPassword).toHaveBeenCalledWith(registerUserTestObject.password);
      expect(createdUser).toEqual(expectedUser);
    });

    it('should call userRepository.create with correct params', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValueOnce(userStubObject);

      await userService.createUser(registerUserObject);

      expect(userRepository.create).toHaveBeenCalledWith(registerUserObject);
    });

    it('should not create a user with duplicate email', async () => {
      await expect(userService.createUser(registerUserObject)).rejects.toThrowError(QueryFailedError);
    });

    it('should not create a user with invalid role', async () => {
      const testUser: MockRegisterUserDto = new MockRegisterUserDto();
      testUser.username = 'TestUser';
      testUser.email = 'testemail@email.de';
      testUser.password = 'HelloWorld.!2';
      testUser.role = 'TestUser' as Role;

      await expect(userService.createUser(testUser)).rejects.toThrowError(QueryFailedError);
    });
  });

  /**
   * Get a user.
   */
  describe('get a user', () => {
    /**
     * Get a user by id.
     */
    describe('when findUserById is called', () => {
      it('should return a user with the given id', async () => {
        const returnedUser: User = await userService.findUserById(userStubObject, userStubObject.id);
        expect(returnedUser.id).toEqual(userStubObject.id);
        expect(returnedUser).toEqual(expectedUser);
      });

      it('should call userRepository.findOneOrFail with correct params', async () => {
        jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(userStubObject);

        await userService.findUserById(userStubObject, userStubObject.id);
        expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
          where: {
            id: userStubObject.id,
          },
        });
      });

      it('should not return user with no existing id', async () => {
        await expect(userService.findUserById(userStubObject, nonExistentUserId)).rejects.toThrowError(
          EntityNotFoundError,
        );
      });
    });

    /**
     * Get a user by email.
     */
    describe('when findUserByEmail is called', () => {
      it('should return a user with the given email', async () => {
        const returnedUser: User = await userService.findUserByEmail(userStubObject.email);
        expect(returnedUser).toEqual(expectedUser);
      });

      it('should call userRepository.findOne with correct params', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userStubObject);

        await userService.findUserByEmail(userStubObject.email);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: userStubObject.email,
          },
        });
      });

      it('should not return user with no existing email', async () => {
        expect(await userService.findUserByEmail('random@email.de')).toEqual(null);
      });
    });
  });

  /**
   * Get all users.
   */
  describe('get all users', () => {
    describe('when findAll is called', () => {
      it('should return all users', async () => {
        const returnedUsers: User[] = await userService.findAll(userStubObject);
        expect(returnedUsers).toEqual([expectedUser, expectedUser]);
      });

      it('should call userRepository.find', async () => {
        jest.spyOn(userRepository, 'find').mockResolvedValueOnce([userStubObject]);

        await userService.findAll(userStubObject);

        expect(userRepository.find).toHaveBeenCalled();
      });
    });
  });

  /**
   * Update a user.
   */
  describe('update a user', () => {
    describe('when updateUserById is called', () => {
      it('should update a user with the given id', async () => {
        const updatedUser: User = await userService.updateUserById(
          userStubObject,
          userStubObject.id,
          updateUserStubObject,
        );
        expect(updatedUser.id).toEqual(userStubObject.id);
        expect(updatedUser.username).toEqual(updateUserStubObject.username);
      });

      it('should not update a user with no existing id', async () => {
        await expect(
          userService.updateUserById(userStubObject, nonExistentUserId, updateUserStubObject),
        ).rejects.toThrowError(EntityNotFoundError);
      });
    });
  });

  /**
   * Delete a user.
   */
  describe('delete a user', () => {
    describe('when deleteUser is called', () => {
      it('should return undefined if user successfully deleted', async () => {
        const deletedUserId: number = await userService.deleteUserById(userStubObject, userStubObject.id);
        expect(deletedUserId).toEqual(userStubObject.id);
      });

      it('should call userRepository.delete with correct params', async () => {
        jest.spyOn(userRepository, 'delete');

        await userService.deleteUserById(userStubObject, userStubObject.id);
        expect(userRepository.delete).toHaveBeenCalledWith(userStubObject.id);
      });

      it('should throw an error if no user with this id exists', async () => {
        await expect(userService.deleteUserById(userStubObject, nonExistentUserId)).rejects.toThrowError(
          EntityNotFoundError,
        );
      });
    });
  });
});
