import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Logger } from '../../../logger/logger.service';
import { IErrorMessage } from './error.message.interface';
import { IErrorResponse } from './error.response.interface';

/**
 * GlobalHttpExceptionFilter for catching errors.
 */
@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter, IErrorMessage {
  constructor(private logger: Logger) {
    this.logger.setContext(GlobalHttpExceptionFilter.name);
  }

  getErrorMessage = <T>(exception: T): string[] => {
    if (exception instanceof HttpException) {
      return exception['response']['message'] instanceof Array
        ? exception['response']['message']
        : [exception['response']['message']];
    }

    return ['Sorry we are experiencing technical problems.'];
  };

  getStatusCode = <T>(exception: T): number => {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
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

    if (exception instanceof NotFoundException && message.length === 0 && !Array.isArray(message)) {
      responseBody.message = ['Page not found.'];
    }

    response.status(responseBody.statusCode).json(responseBody);

    // log error with stack trace
    this.logger.error(
      `statusCode: ${responseBody.statusCode} message: ${responseBody.message} error: ${responseBody.error} path: ${request.url}`,
      `stack::${errorStack}`,
    );
  }
}
