import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './users.entity';
import { KeyObject } from '../types/common.type';
import { JwtService } from '@nestjs/jwt';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
  getUser(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ username: username });
  }
  findOne(username: string): Promise<UserEntity> {
    console.log(username);
    return this.usersRepository.findOne({ username: username });
  }
  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async registration(data: KeyObject): Promise<UserEntity> {
    const hashPass = await bcrypt.hash(data.password, saltOrRounds);

    const user = new UserEntity();
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
    console.log(user);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  update(id: string, data: KeyObject): KeyObject {
    return data;
  }
}
