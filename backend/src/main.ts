import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Logger } from './logger/logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalHttpExceptionFilter } from './common/filters';
import { swaggerConfig } from './config/swagger';
import { TypeORMExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // make sure all logs will be buffered until custom logger is attached
    bufferLogs: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  app.enableCors({
    origin: 'http://localhost:3000',
  });
  // use our custom logger
  const logger: Logger = new Logger();
  app.useLogger(logger);
  app.useGlobalFilters(new GlobalHttpExceptionFilter(logger));
  app.useGlobalFilters(new TypeORMExceptionFilter(logger));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(5001);
}

bootstrap();
