import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DATABASE, COMMON } from '../keys';
// const DATABASE: any = require('../keys');

class ConfigService {
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
      ssl: COMMON.DEBUG === false,
      synchronize: this.isProduction(),
      logging: false,
      entities: ['dist/**/*.entity.js'],
      migrationsTableName: 'migration',
      migrations: ['dist/migration/**/*.js'],
      subscribers: ['dist/subscriber/**/*.js'],
      cli: {
        entitiesDir: 'dist/entity',
        migrationsDir: 'dist/migration',
        subscribersDir: 'dist/subscriber',
      },
    };
  }
}

const configService = new ConfigService();

export { configService };
