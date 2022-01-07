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
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostListQuery } from 'src/post/dto/post.urlParser.dto';
import { imgFileFilter } from 'src/common/filter/file.filter';
import { storage } from 'src/common/file.handler';
import { getImage } from 'src/common/utils/index';
import { UserService } from '../service/user.service';
import { RegistrationDto, UserUpdateDto } from '../dto/user.dto';
import { UserEntity } from '../user.entity';

const pictureField = 'picture';
if (pictureField !== UserEntity.pictureField) {
  throw new Error('User invalid image field');
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('registration')
  async registration(@Body() payload: RegistrationDto) {
    return this.userService.registration(payload);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.userService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
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
    return await this.userService.update(
      req.user?.id,
      payload,
      getImage(files, pictureField),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Request() req) {
    return this.userService.delete(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('posts')
  async gerUserPost(@Request() req, @Query() query: PostListQuery) {
    return await this.userService.getUserPosts(req.user.id, query);
  }
}
