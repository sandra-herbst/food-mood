import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

/**
 * Custom parser that makes a file upload required. Needs to be passed into
 * the endpoint parameter as @UploadedFile(ParseFile)
 */
@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new BadRequestException('Validation failed (file expected)');
    }

    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException('Validation failed (files expected)');
    }

    return files;
  }
}
