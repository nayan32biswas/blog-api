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

import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { PostDetailsParams } from './dto/posts.params.dto';
import { PostCreateDto, PostUpdateDto } from './dto/posts.body.dto';
import { PostDetailsQuery } from './dto/posts.query.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { imgFileFilter, storage } from '../common/filter/file.filter';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
      fileFilter: imgFileFilter,
      storage: storage,
    }),
  )
  @Post()
  async create(
    @Request() req,
    @Body() body: PostCreateDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[] },
  ) {
    console.log(JSON.stringify(files));
    console.log(body);
    return await this.postService.create(req.user.id, body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getPosts(@Query() query: PostDetailsQuery) {
    return this.postService.getPosts(query);
  }

  @Get(':slug')
  getPost(@Param('slug') slug: string) {
    return this.postService.getPost(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  async update(
    @Request() req,
    @Param() params: PostDetailsParams,
    @Body() data: PostUpdateDto,
  ) {
    return await this.postService.update(req.user.id, params.postSlug, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  delete(@Request() req, @Param('slug') slug: string) {
    return this.postService.delete(req.user.id, slug);
  }
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.postService.delete(id);
  // }
}
