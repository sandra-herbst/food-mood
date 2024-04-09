import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { EXPIRES } from './jwt.config';
import { ConfigService } from '@nestjs/config';

export const jwtOptions: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get<string>('SECRET'),
      signOptions: { expiresIn: EXPIRES },
    };
  },
  inject: [ConfigService],
};
