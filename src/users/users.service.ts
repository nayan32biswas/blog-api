import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './users.entity';
import { KeyObject } from '../common/types/common.type';
import { JwtService } from '@nestjs/jwt';
import { UserUpdateDto } from './types/users.dto';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async registration(data: KeyObject): Promise<User> {
    const hashPass = await bcrypt.hash(data.password, saltOrRounds);

    const user = new User();
    user.password = hashPass;
    user.email = data.email;
    user.username = data.email.match(/^([^@]*)@/)[1];
    user.firstName = data.firstName;
    user.lastName = data.lastName;

    await this.usersRepository.save(user);
    return user;
  }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ username: username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: 'Implement It',
    };
  }

  async getProfile(id: number) {
    return await this.usersRepository.findOne(id);
  }

  async update(id: string, data: UserUpdateDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    data.firstName !== user.firstName && (user.firstName = data.firstName);
    data.lastName !== user.lastName && (user.lastName = data.lastName);
    data.birthDate !== user.birthDate && (user.birthDate = data.birthDate);
    // Object.keys(data).forEach((key: string) => {
    //   console.log(key);
    // });
    return await this.usersRepository.save(user);
  }
  async delete(id: number): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    this.usersRepository.remove(user);
  }
}
