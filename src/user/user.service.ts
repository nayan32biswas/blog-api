import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { KeyObject } from '../types/common.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
  getUser(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }
  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  registration(data: KeyObject): KeyObject {
    return data;
  }
  login(data: KeyObject): KeyObject {
    return data;
  }
  update(id: string, data: KeyObject): KeyObject {
    return data;
  }
}
