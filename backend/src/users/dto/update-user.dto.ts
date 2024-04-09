import { PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from '../../auth/dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) implements Readonly<UpdateUserDto> {}
