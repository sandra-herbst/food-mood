import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerResponseConfig } from '../../../config/swagger';

/**
 * Custom decorator for Deleting id resource endpoints that are secured with the token.
 * Defines errors for swagger.
 */
export function DeleteIdResourceResponse() {
  return applyDecorators(
    // No permission
    ApiForbiddenResponse(SwaggerResponseConfig.API_RES_FORBIDDEN),
    // Entity does not exist
    ApiNotFoundResponse(SwaggerResponseConfig.API_RES_NOTFOUND),
    // Param is string
    ApiBadRequestResponse(SwaggerResponseConfig.API_RES_BAD_RQ),
    // Token is invalid
    ApiUnauthorizedResponse(SwaggerResponseConfig.API_RES_UNAUTHORIZED),
  );
}
