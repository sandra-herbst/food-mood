import { ApiResponseOptions } from '@nestjs/swagger';

/**
 * Defines generalized descriptions about errors that can happen within endpoints.
 * Used for the swagger documentation.
 */
export class SwaggerResponseConfig {
  static readonly API_RES_UNAUTHORIZED: ApiResponseOptions = {
    description: 'Authentication failed.',
  };

  static readonly API_RES_FORBIDDEN: ApiResponseOptions = {
    description: 'Forbidden resource. You do not have permission to access the data.',
  };

  static readonly API_RES_BAD_RQ: ApiResponseOptions = {
    description: 'Given attribute is not valid. E.g: Email is not an email or given parameter is not a number/string.',
  };

  static readonly API_RES_LARGE_PAYLOAD: ApiResponseOptions = {
    description: 'Given file is too large.',
  };

  static readonly API_RES_NOTFOUND: ApiResponseOptions = {
    description: 'Resource does not exist.',
  };

  static readonly API_UNPROCESSABLE_ENTITY: ApiResponseOptions = {
    description: 'Another resource with this data already exists.',
  };
}
