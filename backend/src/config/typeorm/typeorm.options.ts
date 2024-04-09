import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './typeorm.config.service';

const typeOrmAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  // configure data source options
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
    new TypeOrmConfigService(configService).getTypeOrmConfig(),
  // dataSource receives the configured DataSourceOptions
  // and returns a Promise<DataSource>.
  dataSourceFactory: async (options): Promise<DataSource> => {
    return await new DataSource(options).initialize();
  },
  inject: [ConfigService],
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = typeOrmAsyncOptions;
