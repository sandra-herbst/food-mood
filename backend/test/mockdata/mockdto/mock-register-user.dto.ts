import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { PasswordRequirementValidation } from '../../../src/common/validators';
import { Role } from '../../../src/users/user-roles';

/**
 * Mock DTO for unit tests.
 */
export class MockRegisterUserDto implements Readonly<MockRegisterUserDto> {
  /**
   * Must contain at least one character.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password should at least contain one uppercase letter, one lowercase letter, one digit and a special character.
   * @example Miau.6
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Validate(PasswordRequirementValidation)
  password: string;

  @IsNotEmpty()
  role: Role = Role.User;
}
