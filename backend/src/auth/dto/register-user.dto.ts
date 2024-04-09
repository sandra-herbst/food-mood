import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { PasswordRequirementValidation } from '../../common/validators';

export class RegisterUserDto implements Readonly<RegisterUserDto> {
  /**
   * Must contain at least one character.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(42)
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
}
