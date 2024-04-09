import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { TransformArray } from '../../common/decorators';

export class QueryRandomDishesDto {
  /**
   * It has to be a comma separated list of label ids
   * @example 1,2
   */
  @TransformArray()
  @IsOptional()
  labels?: number[];

  /**
   * A user will only request one dishType for the game.
   * pass in the id of the dishType.
   * @example 2
   */
  @IsNumber()
  dishType: number;

  /**
   * How many dishes are being sent as a response.
   * @example 10
   */
  @IsNumber()
  @Max(100)
  @Min(1)
  limit: number;
}
