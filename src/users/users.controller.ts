import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegistrationDto, UserUpdateDto } from './users.dto';
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
    return this.usersService.getProfile(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() payload: UserUpdateDto) {
    console.log(req.user, payload);
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
}
