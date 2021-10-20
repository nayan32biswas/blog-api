import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { KeyObject } from '../types/common.type';
import { RegistrationDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
  @Get(':id')
  getUser(@Req() req, @Param() params, @Query() query) {
    console.log(`Base url: '${req.baseUrl}'`, params, query);
    return this.usersService.getUser(params.id);
  }
  @Post('registration')
  async registration(@Body() payload: RegistrationDto) {
    console.log(payload);
    return this.usersService.registration(payload);
  }
  @Post('login')
  async login(@Body('user') payload: KeyObject) {
    return this.usersService.login(payload);
  }
  @Put(':id')
  async update(@Param() params, @Body('user') payload: KeyObject) {
    return await this.usersService.update(params.id, payload);
  }
  @Delete(':id')
  delete(@Param() params) {
    return this.usersService.delete(params.id);
  }
}
