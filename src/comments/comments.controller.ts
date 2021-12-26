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
import { CommentsService } from './comments.service';
import { CommentCreateDto, CommentUpdateDto } from './dto/comments.body.dto';
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
  async createComment(
    @Request() req,
    @Body() body: CommentCreateDto,
    @Param() params: PostDetailsParams,
  ) {
    console.log(req.user);
    return await this.commentsService.createComment(
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
  async updateComment(
    @Request() req,
    @Body() data: CommentUpdateDto,
    @Param() params: CommentDetailsParams,
  ) {
    return await this.commentsService.updateComment(
      req.user.id,
      params.postSlug,
      params.commentId,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  deleteComment(@Request() req, @Param() params: CommentDetailsParams) {
    return this.commentsService.deleteComment(
      req.user.id,
      params.postSlug,
      params.commentId,
    );
  }
}
