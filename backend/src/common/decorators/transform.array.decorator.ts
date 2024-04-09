import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

/**
 * Custom decorator for transforming query arrays.
 */
export function TransformArray() {
  return applyDecorators(
    Type(() => Array<number>),
    IsArray(),
    IsNumber({}, { each: true }),
    Transform(({ value }) => transformToNumberArray(value)),
  );
}

/**
 * Transform comma separated list to number array.
 * @param value sent by the client. E.g. "1,2"
 */
export function transformToNumberArray(value: string) {
  if (!value) {
    // Client requests to remove all labels from the dish
    return [-1];
  }
  return value.toString().split(',').map(Number);
}
