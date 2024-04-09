import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from './dishes/dish.module';
import { UserDecisionModule } from './decisions/user-decision.module';
import jwtConfig from './config/jwt/jwt.config';
import typeormConfig, { typeOrmConfigOptions } from './config/typeorm/typeorm.config';
import { LoggerModule } from './logger/logger.module';
import { RequestLoggerMiddleware } from './common/middleware/request.logger.middleware';
import filesConfig from './config/files/files.config';
import { validate } from './config/env-config.validation';
import { CaslModule } from './casl/casl.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `../.env`, // won't work with docker
      load: [jwtConfig, filesConfig, typeormConfig],
      isGlobal: true,
      cache: true,
      validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigOptions),
    DishModule,
    UserModule,
    UserDecisionModule,
    AuthModule,
    LoggerModule,
    CaslModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
