import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces';
import { UserService } from '../users/user.service';
import { TokenRO } from './dto';
import { EXPIRES } from '../config/jwt';
import { User } from 'src/users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  /**
   * Validates user login data with the database and returns token on success.
   * @param email sent by the client.
   * @param password sent by the client.
   */
  async login(email: string, password: string): Promise<TokenRO> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      tokenData: {
        access_token: await this.generateAccessToken(user),
        expires_in: EXPIRES,
      },
    };
  }

  /**
   * Validate user by comparing password with hash in the database.
   * @param email sent by the client.
   * @param password sent by the client.
   * @private
   */
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Generates an access token and secures userId in the payload.
   * @param user that has requested a token.
   */
  private async generateAccessToken(user: User): Promise<string> {
    const payload: IJwtPayload = { userId: user.id };
    return this.jwtService.sign(payload);
  }

  /**
   * Register a new user in the database.
   * @param registerUserDto data that has been sent by the client.
   */
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    return await this.usersService.createUser(registerUserDto);
  }
}
