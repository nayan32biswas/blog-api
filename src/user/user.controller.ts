import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('users')
  getUsers(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get()
  getUser(): string[] {
    return ['this.usersService.findAll()'];
  }
}
