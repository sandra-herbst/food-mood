import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

/**
 * Defines file body of any single image upload for swagger docs.
 * Used only when the image is being uploaded on a single endpoint.
 */
export function ApiFileBody() {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
