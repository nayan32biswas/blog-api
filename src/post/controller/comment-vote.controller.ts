import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { VoteCreateUpdateDto } from '../dto/vote.body.dto';
import { CommentVoteService } from '../service/comment-vote.service';
import { CommentDetailsParams } from '../dto/comments.urlParser.dto';

@Controller('post/:postSlug/comment/:commentId/vote')
export class CommentVoteController {
  constructor(private readonly commentVoteService: CommentVoteService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async createOrUpdateCommentVote(
    @Request() req,
    @Body() body: VoteCreateUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentVoteService.createOrUpdateCommentVote(
      req.user.id,
      params.postSlug,
      params.commentId,
      body,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getCommentVotes(
    @Query() query: PaginationQuery,
    @Param() params: CommentDetailsParams,
  ) {
    return this.commentVoteService.getCommentVotes(query, params.commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteCommentVote(@Request() req, @Param() params: CommentDetailsParams) {
    return this.commentVoteService.deleteCommentVote(
      req.user.id,
      params.commentId,
    );
  }
}
