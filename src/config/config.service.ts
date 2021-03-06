import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { commaSeperateStringToArray } from 'src/common/utils/strings';

import { KeyObject } from '../common/types/common.type';

export const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) {
  console.log('Development Mode');
} else {
  console.log('Production Mode');
}

export const SECRET_KEY = process.env.SECRET_KEY;

export const EMAIL_CONF: KeyObject = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
};

export const HOST = process.env.HOST || 'http://localhost:8000';
export const PAGE_SIZE = 10;
export const TOKEN_EXPIRES_IN = '7d';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';
export const EMAIL_VERIFICATION_EXPIRES_IN = '1h';
export const JWT_ALGORITHM = 'HS256';
export const DEFAULT_LIMIT = 20;
export const MEDIA_ROOT = './media/';
export const ALLOWED_HOSTS = commaSeperateStringToArray(
  process.env.ALLOWED_HOSTS || 'http://localhost:8080',
);

class ConfigService {
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: !DEBUG,
      synchronize: DEBUG, // TODO: make it false, don't update table automatically
      logging: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migration',
      migrations: ['dist/migrations/*{.ts,.js}'],
      subscribers: ['dist/subscribers/*.js'],
      cli: {
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers',
      },
    };
  }
}

export const configService = new ConfigService();
