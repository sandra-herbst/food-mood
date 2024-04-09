import { ApiConsumes, ApiPayloadTooLargeResponse } from '@nestjs/swagger';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import LocalImagesInterceptor from '../interceptors/local.images.interceptor';
import { SwaggerResponseConfig } from '../../config/swagger';

/**
 * Custom decorator for file uploads.
 * @param path after 'public/img'. For example, users or dishes
 * @constructor
 */
export function ApiFile(path: string) {
  return applyDecorators(
    ApiPayloadTooLargeResponse(SwaggerResponseConfig.API_RES_LARGE_PAYLOAD),
    UseInterceptors(
      LocalImagesInterceptor({
        fieldName: 'file',
        path: path,
      }),
    ),
    ApiConsumes('multipart/form-data'),
  );
}
