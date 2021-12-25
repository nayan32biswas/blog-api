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
  UploadedFiles,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { RegistrationDto, UserUpdateDto } from './types/users.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PostListQuery } from '../posts/dto/posts.urlParser.dto';
import { UserEntity } from './users.entity';
import { imgFileFilter } from '../common/filter/file.filter';
import { storage } from '../common/file.handler';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { getImage } from '../common/utils/index';

const pictureField = 'picture';
if (pictureField !== UserEntity.pictureField) {
  throw new Error('User invalid image field');
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('registration')
  async registration(@Body() payload: RegistrationDto) {
    console.log(payload);
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
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: pictureField, maxCount: 1 }], {
      fileFilter: imgFileFilter,
      storage: storage,
    }),
  )
  @Put('profile')
  async update(
    @Request() req,
    @Body() payload: UserUpdateDto,
    @UploadedFiles()
    files: { [pictureField]?: Express.Multer.File[] },
  ) {
    return await this.usersService.update(
      req.user?.id,
      payload,
      getImage(files, pictureField),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Request() req) {
    return this.usersService.delete(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('posts')
  async gerUserPost(@Request() req, @Query() query: PostListQuery) {
    return await this.usersService.getUserPosts(req.user.id, query);
  }
}
