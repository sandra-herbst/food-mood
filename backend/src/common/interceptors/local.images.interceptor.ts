import { BadRequestException, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import e from 'express';
import { v4 as uuidv4 } from 'uuid';

interface LocalImagesInterceptorOptions {
  fieldName: string;
  path?: string;
}

/**
 * Interceptor that is responsible for saving images locally into the static backend folders.
 */
function LocalImagesInterceptor(options: LocalImagesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = configService.get<string>('DESTINATION');
      // further path is passed in from the endpoint individually.
      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        // Enable file size limits
        limits: {
          fileSize: configService.get<number>('MAX_SIZE'),
        },
        storage: diskStorage({
          destination,
          filename(req: e.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
            cb(null, uuidv4() + extname(file.originalname));
          },
        }),
        // Check the mimetypes to allow for upload
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            cb(null, true);
          } else {
            // Reject file
            cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`), false);
          }
        },
      };

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalImagesInterceptor;
