import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './typeorm.options';
import entities from './entities';
import subscribers from './subscribers';

export default () => ({
  ENVIRONMENT: process.env.NODE_ENV,
  DB_HOST: process.env.POSTGRES_DB_HOST,
  PORT: process.env.POSTGRES_DB_PORT,
  USER: process.env.POSTGRES_USER,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DATABASE: process.env.POSTGRES_DB,
});

export const typeOrmConfigOptions: TypeOrmModuleOptions = typeOrmAsyncConfig;

// for seeding db
export const seederConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities,
  subscribers: subscribers,
  autoLoadEntities: true,
  synchronize: true,
};
