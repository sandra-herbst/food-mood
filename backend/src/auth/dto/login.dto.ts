import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements Readonly<LoginDto> {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
