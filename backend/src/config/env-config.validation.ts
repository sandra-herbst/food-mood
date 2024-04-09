import { plainToInstance } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';

export enum EnvironmentType {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  @IsNotEmpty()
  NODE_ENV: EnvironmentType;

  // postgres config
  @IsAlphanumeric()
  @IsNotEmpty()
  POSTGRES_DB_HOST: string;

  @IsNumber()
  @Min(4)
  POSTGRES_DB_PORT: number;

  @IsAlphanumeric()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsNotEmpty()
  FALLBACK_HOST: string;

  // security
  @IsNotEmpty()
  JWT_APP_SECRET: string;

  // file upload
  @IsNotEmpty()
  UPLOADED_IMAGES_DESTINATION: string;

  // pgAdmin config
  @IsEmail()
  @IsNotEmpty()
  PGADMIN_DEFAULT_EMAIL: string;

  @IsNotEmpty()
  PGADMIN_DEFAULT_PASSWORD: string;

  @IsBoolean()
  @IsNotEmpty()
  PGADMIN_CONFIG_SERVER_MODE: boolean;

  // typeorm config
  @IsNotEmpty()
  TYPEORM_SEEDING_FACTORIES: string;

  @IsNotEmpty()
  TYPEORM_SEEDING_SEEDS: string;
}

/**
 * Method to validate variables against the constraints.
 * @param configuration, that gets mapped against the EnvironmentVariables class.
 * @returns the validated config.
 */
export function validate(configuration: Record<string, unknown>): EnvironmentVariables {
  const validatorConfig = plainToInstance(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors: ValidationError[] = validateSync(validatorConfig);

  if (errors.length > 0 && validatorConfig.NODE_ENV !== EnvironmentType.Test) {
    throw new Error(`${errors}`);
  }

  return validatorConfig;
}
