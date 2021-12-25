import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentVotesController } from './comment.votes.controller';
import { PostVotesService } from './post.votes.service';
import { PostVoteEntity, CommentVoteEntity } from './votes.entity';
import { PostVotesController } from './post.votes.controller';
import { CommentVotesService } from './comment.votes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostVoteEntity, CommentVoteEntity])],
  controllers: [CommentVotesController, PostVotesController],
  providers: [PostVotesService, CommentVotesService],
})
export class VotesModule {}
