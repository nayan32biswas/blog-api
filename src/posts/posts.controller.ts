import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { KeyObject } from '../common/types/common.type';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { PostCreateDto, PostUpdateDto } from './types/posts.dto';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() postCreateDto: PostCreateDto) {
    return await this.postService.create(req.user.id, postCreateDto);
  }
  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
  @Get(':slug')
  getPost(@Param('slug') slug: string) {
    return this.postService.getPost(slug);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  async update(
    @Request() req,
    @Param('slug') slug: string,
    @Body() data: PostUpdateDto,
  ) {
    return await this.postService.update(req.user.id, slug, data);
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
