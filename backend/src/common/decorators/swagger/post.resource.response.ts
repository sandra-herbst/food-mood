import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SwaggerResponseConfig } from '../../../config/swagger';

/**
 * Custom decorator for Post resource endpoints that are secured with the token.
 * Defines errors for swagger.
 */
export function PostResourceResponse() {
  return applyDecorators(
    // No permission
    ApiForbiddenResponse(SwaggerResponseConfig.API_RES_FORBIDDEN),
    // Param is string/data that has been sent is invalid
    ApiBadRequestResponse(SwaggerResponseConfig.API_RES_BAD_RQ),
    // Token is invalid
    ApiUnauthorizedResponse(SwaggerResponseConfig.API_RES_UNAUTHORIZED),
    // Data conflicts with another entity (E.g. email has already been used)
    ApiUnprocessableEntityResponse(SwaggerResponseConfig.API_UNPROCESSABLE_ENTITY),
  );
}
