import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  Body,
  // Query,
  // Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { KeyObject } from '../types/common.type';
import { RegistrationDto } from './users.dto';
// import { User } from './users.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
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
  @Put(':id')
  async update(@Param() params, @Body('user') payload: KeyObject) {
    return await this.usersService.update(params.id, payload);
  }
  @Delete(':id')
  delete(@Param() params) {
    return this.usersService.delete(params.id);
  }
}
