import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './user/user.module';
import { configService } from './config/config.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    CommonModule,
  ],
})
export class AppModule {}
