import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransformArray } from '../../common/decorators';

export class CreateDishDto {
  /**
   * Binary File.
   */
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  @MaxLength(42)
  name: string;

  @TransformArray()
  @IsOptional()
  labels?: number[];

  @TransformArray()
  dishTypes: number[];
}
