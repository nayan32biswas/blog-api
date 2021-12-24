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
import { PostDetailsParams } from './dto/posts.params.dto';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import { PostListQuery } from './dto/posts.query.dto';
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
  async create(
    @Request() req,
    @Body() body: PostCreateDto,
    @UploadedFiles()
    files: { [postImage]?: Express.Multer.File[] },
  ) {
    return await this.postService.create(
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
  @Get(':slug')
  getPost(@Param('slug') slug: string) {
    return this.postService.getPost(slug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: postImage, maxCount: 1 }], {
      fileFilter: imgFileFilter,
      storage: storage,
    }),
  )
  @Put(':slug')
  async update(
    @Request() req,
    @Body() data: PostUpdateDto,
    @Param() params: PostDetailsParams,
    @UploadedFiles()
    files: { [postImage]?: Express.Multer.File[] },
  ) {
    return await this.postService.update(
      req.user.id,
      params.slug,
      data,
      getImage(files, postImage),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  delete(@Request() req, @Param('slug') slug: string) {
    return this.postService.delete(req.user.id, slug);
  }
}
