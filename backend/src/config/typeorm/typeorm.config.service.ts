import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import entities from './entities';
import subscribers from './subscribers';
import { EnvironmentType } from '../env-config.validation';

/**
 * Provides TypeOrm Config values based on the environment.
 */
export class TypeOrmConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Method to get the value of the port.
   * @returns A number with value of the port.
   */
  public getPort(): number {
    return this.getValue<number>('PORT');
  }

  /**
   * Checks if the current environment is production.
   * @returns True if current environment is production, otherwise false (development, test).
   */
  public isProduction(): boolean {
    const environment = this.getEnvironment();
    return environment != EnvironmentType.Dev && environment != EnvironmentType.Test;
  }

  /**
   * Method to get the current config based on the environment.
   * @returns A TypeOrmModuleOptions that holds the corresponding config values of the current environment.
   */
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    switch (this.getEnvironment()) {
      case EnvironmentType.Dev: {
        return this.getDevTypeOrmConfig();
      }
      case EnvironmentType.Prod: {
        return this.getProdTypeOrmConfig();
      }
      case EnvironmentType.Test: {
        return this.getTestTypeOrmConfig();
      }
    }
  }

  private getEnvironment(): string {
    return this.configService.get<string>('ENVIRONMENT');
  }

  private getValue<T>(key: string, throwOnMissing = false): T {
    const value = this.configService.get<T>(key);
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  private getProdTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.getPort(),
      username: this.configService.get<string>('USER'),
      password: this.configService.get<string>('PASSWORD'),
      database: this.configService.get<string>('DATABASE'),
      logging: false,
      entities: entities,
      subscribers: subscribers,
      autoLoadEntities: true,
      synchronize: false,
      ssl: this.isProduction(),
    };
  }

  private getDevTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.getPort(),
      username: this.configService.get<string>('USER'),
      password: this.configService.get<string>('PASSWORD'),
      database: this.configService.get<string>('DATABASE'),
      logging: false,
      entities: entities,
      subscribers: subscribers,
      autoLoadEntities: true,
      synchronize: true,
      ssl: this.isProduction(),
    };
  }

  private getTestTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      logging: false,
      entities: entities,
      subscribers: subscribers,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
