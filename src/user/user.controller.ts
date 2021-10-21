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
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { KeyObject } from '../types/common.type';
import { RegistrationDto } from './user.dto';
import { User } from './user.interface';

@Controller('user')
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
  getUser(@Req() req, @Param('id', ParseIntPipe) id: number, @Query() query) {
    console.log(`Base url: '${req.baseUrl}'`, id, query);
    // if (req.data.demo) {
    //   // rise 500 error
    // }
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.usersService.getUser(id);
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
