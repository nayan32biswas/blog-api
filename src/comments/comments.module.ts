import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from './comments.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
