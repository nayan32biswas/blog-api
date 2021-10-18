import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DATABASE, COMMON } from '../keys';
// const DATABASE: any = require('../keys');

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return DATABASE.PORT;
  }

  public isProduction() {
    return COMMON.DEBUG == false;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: DATABASE.HOST,
      port: DATABASE.PORT,
      username: DATABASE.POSTGRES_USER,
      password: DATABASE.POSTGRES_PASSWORD,
      database: DATABASE.POSTGRES_DATABASE,

      entities: ['**/*.entity{.ts,.js}'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },
      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  DATABASE.HOST,
  DATABASE.PORT,
  DATABASE.POSTGRES_USER,
  DATABASE.POSTGRES_PASSWORD,
  DATABASE.POSTGRES_DATABASE,
]);

export { configService };
