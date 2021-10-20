import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { KeyObject } from '../types/common.type';

export const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) {
  console.log('Development Mode');
} else {
  console.log('Production Mode');
}

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
export const TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '72h';
export const EMAIL_VERIFICATION_EXPIRES_IN = '1h';
export const JWT_ALGORITHM = 'HS256';

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
