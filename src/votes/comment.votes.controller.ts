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
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { CommentVotesService } from './comment.votes.service';
import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';
import { CommentDetailsParams } from '../comments/dto/comments.urlParser.dto';

@Controller('post/:postSlug/comment/:commentId/vote')
export class CommentVotesController {
  constructor(private readonly commentVotesService: CommentVotesService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async createOrUpdateCommentVote(
    @Request() req,
    @Body() body: VoteCreateUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentVotesService.createOrUpdateCommentVote(
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
    return this.commentVotesService.getCommentVotes(query, params.commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteCommentVote(@Request() req, @Param() params: CommentDetailsParams) {
    return this.commentVotesService.deleteCommentVote(
      req.user.id,
      params.commentId,
    );
  }
}
