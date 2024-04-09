import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { IErrorMessage } from './error.message.interface';
import { Logger } from '../../../logger/logger.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { IErrorResponse } from './error.response.interface';

/**
 * TypeORMExceptionFilter for catching most common typeorm errors.
 */
@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter, IErrorMessage {
  constructor(private logger: Logger) {
    this.logger.setContext(TypeORMExceptionFilter.name);
  }

  getErrorMessage = <T>(exception: T): string[] => {
    switch (exception.constructor) {
      case QueryFailedError:
        return ['Entity with these attributes already exist.'];

      case EntityNotFoundError:
        return ['Entity with this id does not exist.'];

      default:
        return ['Sorry we are experiencing technical problems.'];
    }
  };

  getStatusCode = <T>(exception: T): number => {
    switch (exception.constructor) {
      case QueryFailedError:
        return HttpStatus.UNPROCESSABLE_ENTITY;

      case EntityNotFoundError:
        return HttpStatus.NOT_FOUND;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  };

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const statusCode: number = this.getStatusCode<Error>(exception);
    const message: string[] = this.getErrorMessage<Error>(exception);

    const errorStack: string = exception.stack;

    const responseBody: IErrorResponse = {
      statusCode: statusCode,
      message: message,
      error: exception.name,
    };

    response.status(responseBody.statusCode).json(responseBody);

    // log error with stack trace
    this.logger.error(
      `statusCode: ${responseBody.statusCode} message: ${responseBody.message} error: ${responseBody.error} path: ${request.url}`,
      `stack::${errorStack}`,
    );
  }
}
