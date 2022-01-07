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
import { PostVoteService } from '../service/post-vote.service';
import { VoteCreateUpdateDto } from '../dto/vote.body.dto';
import { PostDetailsParams } from '../dto/post.urlParser.dto';

@Controller('post/:postSlug/vote')
export class PostVoteController {
  constructor(private readonly postVoteService: PostVoteService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async createOrUpdatePostVote(
    @Request() req,
    @Body() body: VoteCreateUpdateDto,
    @Param() params: PostDetailsParams,
  ) {
    return await this.postVoteService.createOrUpdatePostVote(
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
    return this.postVoteService.getPostVotes(query, params.postSlug);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deletePostVote(@Request() req, @Param() params: PostDetailsParams) {
    return this.postVoteService.deletePostVote(req.user.id, params.postSlug);
  }
}
