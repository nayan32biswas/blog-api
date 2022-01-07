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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentService } from '../service/comment.service';
import { CommentCreateDto, CommentUpdateDto } from '../dto/comments.body.dto';
import { PostDetailsParams } from '../dto/post.urlParser.dto';
import {
  CommentDetailsParams,
  CommentListQuery,
} from '../dto/comments.urlParser.dto';

@Controller('post/:postSlug/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createComment(
    @Request() req,
    @Body() body: CommentCreateDto,
    @Param() params: PostDetailsParams,
  ) {
    return await this.commentService.createComment(
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
    return this.commentService.getComments(query, params.postSlug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':commentId')
  async updateComment(
    @Request() req,
    @Body() data: CommentUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentService.updateComment(
      req.user.id,
      params.postSlug,
      params.commentId,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  deleteComment(@Request() req, @Param() params: CommentDetailsParams) {
    return this.commentService.deleteComment(
      req.user.id,
      params.postSlug,
      params.commentId,
    );
  }
}
