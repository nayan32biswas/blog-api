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
import { CommentsService } from './comment.service';
import { CommentCreateUpdateDto } from './dto/comments.body.dto';
import { PostDetailsParams } from '../posts/dto/posts.urlParser.dto';
import {
  CommentDetailsParams,
  CommentListQuery,
} from './dto/comments.urlParser.dto';

@Controller('post/:postSlug/comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Request() req,
    @Body() body: CommentCreateUpdateDto,
    @Param() params: PostDetailsParams,
  ) {
    return await this.commentsService.create(
      req.user.id,
      params.postSlug,
      body,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getComments(
    @Query() query: CommentListQuery,
    @Param() params: PostDetailsParams,
  ) {
    return this.commentsService.getComments(query, params.postSlug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':commentId')
  async update(
    @Request() req,
    @Body() data: CommentCreateUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentsService.update(
      req.user.id,
      params.postSlug,
      params.commentId,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  delete(@Request() req, @Param() params: CommentDetailsParams) {
    return this.commentsService.delete(
      req.user.id,
      params.postSlug,
      params.commentId,
    );
  }
}
