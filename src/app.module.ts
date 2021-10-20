import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { configService } from './config/config.service';
// import { UsersModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    // UsersModule,
    CommonModule,
    PostModule,
  ],
})
export class AppModule {}
