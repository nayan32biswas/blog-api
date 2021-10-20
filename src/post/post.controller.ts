import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { KeyObject } from '../types/common.type';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
  @Get(':id')
  getPost(@Param() params) {
    return this.postService.getPost(params.id);
  }
  @Post()
  async create(@Body('user') data: KeyObject) {
    return this.postService.create(data);
  }
  @Put(':id')
  async update(@Param() params, @Body('user') data: KeyObject) {
    return await this.postService.update(params.id, data);
  }
  @Delete(':id')
  delete(@Param() params) {
    return this.postService.delete(params.id);
  }
}
