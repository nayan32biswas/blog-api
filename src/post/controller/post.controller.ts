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

import { storage } from 'src/common/file.handler';
import { imgFileFilter } from 'src/common/filter/file.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getImage } from 'src/common/utils/index';
import { PostService } from '../service/post.service';
import { PostDetailsParams, PostListQuery } from '../dto/post.urlParser.dto';
import { PostCreateDto, PostUpdateDto } from '../dto/post.body.dto';
import { PostEntity } from '../post.entity';

const postImage = 'image';
if (postImage !== PostEntity.imageField) {
  throw new Error('Post invalid image field');
}

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
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
    console.log(params);
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
