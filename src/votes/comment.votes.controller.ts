import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';
import { CommentVoteDetailsParams } from './dto/vote.urlParser.dto';
import { CommentVotesService } from './comment.votes.service';
import { CommentDetailsParams } from '../comments/dto/comments.urlParser.dto';

@Controller('post/:postSlug/comment/:commentID')
export class CommentVotesController {
  constructor(private readonly commentVotesService: CommentVotesService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createCommentVote(
    @Request() req,
    @Body() body: VoteCreateUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentVotesService.createCommentVote(
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
    return this.commentVotesService.getCommentVotes(
      query,
      params.postSlug,
      params.commentId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':voteId')
  async updateCommentVote(
    @Request() req,
    @Body() data: VoteCreateUpdateDto,
    @Param() params: CommentVoteDetailsParams,
  ) {
    return await this.commentVotesService.updateCommentVote(
      req.user.id,
      params.postSlug,
      params.commentId,
      params.voteId,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':voteId')
  deleteCommentVote(@Request() req, @Param() params: CommentVoteDetailsParams) {
    return this.commentVotesService.deleteCommentVote(
      req.user.id,
      params.postSlug,
      params.commentId,
      params.voteId,
    );
  }
}
