import { IsNumber, IsOptional } from 'class-validator';

export class QueryDishesDto {
  /**
   * filter dishes by the id of the user that has created the dish.
   * @example 42
   */
  @IsNumber()
  @IsOptional()
  userId?: number;
}
