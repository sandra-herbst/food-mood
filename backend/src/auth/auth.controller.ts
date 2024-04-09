import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, TokenRO } from './dto';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SwaggerResponseConfig } from '../config/swagger';
import { RegisterUserDto, UserRO } from '../users/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login - For the user to access resources of the api. Returns a token
   * that can be passed on each request with the Authorization Bearer Token Header.
   */
  @Post('login')
  @ApiUnauthorizedResponse(SwaggerResponseConfig.API_RES_UNAUTHORIZED)
  @ApiBadRequestResponse(SwaggerResponseConfig.API_RES_BAD_RQ)
  async login(@Body() loginDTO: LoginDto): Promise<TokenRO> {
    return await this.authService.login(loginDTO.email, loginDTO.password);
  }

  /**
   * Register a new user with username, email and password.
   */
  @Post('register')
  @ApiBadRequestResponse(SwaggerResponseConfig.API_RES_BAD_RQ)
  @ApiUnprocessableEntityResponse(SwaggerResponseConfig.API_UNPROCESSABLE_ENTITY)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserRO> {
    return UserRO.fromEntity(await this.authService.register(registerUserDto));
  }
}
