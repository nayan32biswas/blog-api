import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { KeyObject } from '../common/types/common.type';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }
  @Post()
  async create(@Body('user') data: KeyObject) {
    return this.postService.create(data);
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('user') data: KeyObject,
  ) {
    // if (req.data.demo) {
    //   // rise 500 error
    // }
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.postService.update(id, data);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
