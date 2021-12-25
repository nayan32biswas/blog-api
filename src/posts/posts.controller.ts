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
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { storage } from '../common/file.handler';
import { imgFileFilter } from '../common/filter/file.filter';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { PostDetailsParams, PostListQuery } from './dto/posts.urlParser.dto';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import { PostEntity } from './posts.entity';
import { getImage } from '../common/utils/index';

const postImage = 'image';
if (postImage !== PostEntity.imageField) {
  throw new Error('Post invalid image field');
}

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: postImage, maxCount: 1 }], {
      fileFilter: imgFileFilter,
      storage: storage,
    }),
  )
  @Post()
  async createPost(
    @Request() req,
    @Body() body: PostCreateDto,
    @UploadedFiles()
    files: { [postImage]?: Express.Multer.File[] },
  ) {
    return await this.postService.createPost(
      req.user.id,
      body,
      getImage(files, postImage),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getPosts(@Query() query: PostListQuery) {
    return this.postService.getPosts(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':postSlug')
  getPost(@Param() params: PostDetailsParams) {
    return this.postService.getPost(params.postSlug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: postImage, maxCount: 1 }], {
      fileFilter: imgFileFilter,
      storage: storage,
    }),
  )
  @Put(':postSlug')
  async updatePost(
    @Request() req,
    @Body() data: PostUpdateDto,
    @Param() params: PostDetailsParams,
    @UploadedFiles()
    files: { [postImage]?: Express.Multer.File[] },
  ) {
    return await this.postService.updatePost(
      req.user.id,
      params.postSlug,
      data,
      getImage(files, postImage),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postSlug')
  deletePost(@Request() req, @Param() params: PostDetailsParams) {
    return this.postService.deletePost(req.user.id, params.postSlug);
  }
}
