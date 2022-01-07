import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostModule } from './post/post.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    CommonModule,
    UserModule,
    PostModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
