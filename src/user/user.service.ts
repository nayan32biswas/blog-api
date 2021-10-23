import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { KeyObject } from '../types/common.type';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
  getUser(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne(username);
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
  async login(data: KeyObject): Promise<KeyObject> {
    const user = await this.usersRepository.findOne({
      email: data.user_identity,
    });
    if (user === undefined) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (isMatch === true) {
      return {
        message: 'Successful Authentication',
        token: 'Token',
        refreshToken: 'refreshToken',
      };
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
  update(id: string, data: KeyObject): KeyObject {
    return data;
  }
}
