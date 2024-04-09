import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logger/logger.service';

/**
 * Middleware that logs requests.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {
    // Due to transient scope, RequestLoggerMiddleware has its own unique instance of Logger,
    // so setting context here will not affect other instances in other services
    this.logger.setContext(RequestLoggerMiddleware.name);
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { ip, method, originalUrl } = req;

    res.on('close', () => {
      const { statusCode }: { statusCode: number } = res;
      const contentLength: string = res.get('content-length');

      this.logger.info(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${ip}`);
    });

    next();
  }
}
