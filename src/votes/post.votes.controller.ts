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
import { PostDetailsParams } from '../posts/dto/posts.urlParser.dto';
import { PostVotesService } from './post.votes.service';
import { PaginationQuery } from 'src/common/dto/common.query.dto';
import { VoteCreateUpdateDto } from './dto/vote.body.dto';
import { PostVoteDetailsParams } from './dto/vote.urlParser.dto';

@Controller('post/:postSlug/vote')
export class PostVotesController {
  constructor(private readonly postVotesService: PostVotesService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async createOrUpdatePostVote(
    @Request() req,
    @Body() body: VoteCreateUpdateDto,
    @Param() params: PostDetailsParams,
  ) {
    return await this.postVotesService.createOrUpdatePostVote(
      req.user.id,
      params.postSlug,
      body,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getPostVotes(
    @Query() query: PaginationQuery,
    @Param() params: PostDetailsParams,
  ) {
    return this.postVotesService.getPostVotes(query, params.postSlug);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deletePostVote(@Request() req, @Param() params: PostDetailsParams) {
    return this.postVotesService.deletePostVote(req.user.id, params.postSlug);
  }
}
