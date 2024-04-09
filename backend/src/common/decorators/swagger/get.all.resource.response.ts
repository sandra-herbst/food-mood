import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SwaggerResponseConfig } from '../../../config/swagger';

/**
 * Custom decorator for Get all resources endpoints that are secured with the token.
 * Defines errors for swagger.
 */
export function GetAllResourceResponse() {
  return applyDecorators(
    // No permission
    ApiForbiddenResponse(SwaggerResponseConfig.API_RES_FORBIDDEN),
    // Token is invalid
    ApiUnauthorizedResponse(SwaggerResponseConfig.API_RES_UNAUTHORIZED),
  );
}
