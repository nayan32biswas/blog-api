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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { KeyObject } from '../types/common.type';
import { RegistrationDto } from './user.dto';
import { User } from './user.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
@UseGuards(new AuthGuard())
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Post('registration')
  async registration(@Body() payload: RegistrationDto) {
    console.log(payload);
    return this.usersService.registration(payload);
  }
  @Post('login')
  async login(@Body('user') payload: KeyObject) {
    return this.usersService.login(payload);
  }
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
  @Get(':id')
  getUser(@Req() req, @Param('id') username: string, @Query() query) {
    console.log(`Base url: '${req.baseUrl}'`, username, query);
    return this.usersService.getUser(username);
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
