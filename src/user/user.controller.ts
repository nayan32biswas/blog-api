import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get()
  getUser(): string[] {
    return ['this.usersService.findAll()'];
  }
}
