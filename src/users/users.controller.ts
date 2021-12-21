import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { RegistrationDto, UserUpdateDto } from './types/users.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PostListQuery } from '../posts/dto/posts.query.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('registration')
  async registration(@Body() payload: RegistrationDto) {
    return this.usersService.registration(payload);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.usersService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() payload: UserUpdateDto) {
    return await this.usersService.update(req.user?.id, payload);
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Request() req) {
    return this.usersService.delete(req.user.id);
  }

  // @Get()
  // getUsers(): Promise<User[]> {
  //   return this.usersService.getUsers();
  // }
  // @Get(':id')
  // getUser(@Req() req, @Param('id') username: string, @Query() query) {
  //   console.log(`Base url: '${req.baseUrl}'`, username, query);
  //   return this.usersService.getUser(username);
  // }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('posts')
  async gerUserPost(@Request() req, @Query() query: PostListQuery) {
    return await this.usersService.getUserPosts(req.user.id, query);
  }
}
