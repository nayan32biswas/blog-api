import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import {
  TagEntity,
  PostEntity,
  PostVoteEntity,
  CommentVoteEntity,
  CommentEntity,
} from './post.entity';
import { PostVoteController } from './controller/post-vote.controller';
import { CommentVoteController } from './controller/comment-vote.controller';
import { PostVoteService } from './service/post-vote.service';
import { CommentService } from './service/comment.service';
import { CommentVoteService } from './service/comment-vote.service';
import { CommentController } from './controller/comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagEntity,
      PostEntity,
      CommentEntity,
      PostVoteEntity,
      CommentVoteEntity,
    ]),
  ],
  controllers: [
    PostController,
    PostVoteController,
    CommentController,
    CommentVoteController,
  ],
  providers: [PostService, PostVoteService, CommentService, CommentVoteService],
})
export class PostModule {}
