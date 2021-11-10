import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { KeyObject } from '../common/types/common.type';
import { UserEntity } from './users.entity';
import { UserUpdateDto } from './types/users.dto';
import { UserSerializer } from './types/users.serializer';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async registration(userData: KeyObject): Promise<UserEntity> {
    const { password, email, firstName, lastName } = userData;

    const hashPass = await bcrypt.hash(password, saltOrRounds);

    const user = new UserEntity();
    user.password = hashPass;
    user.email = email;
    user.username = email.match(/^([^@]*)@/)[1];
    user.firstName = firstName;
    user.lastName = lastName;

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
    const user = await this.usersRepository.findOne(id);
    return new UserSerializer(user);
  }

  async update(id: string, userData: UserUpdateDto): Promise<UserEntity> {
    const { firstName, lastName, birthDate } = userData;

    const user = await this.usersRepository.findOne(id);

    firstName !== user.firstName && (user.firstName = firstName);
    lastName !== user.lastName && (user.lastName = lastName);
    birthDate !== user.birthDate && (user.birthDate = birthDate);

    return await this.usersRepository.save(user);
  }
  async delete(id: number): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    this.usersRepository.remove(user);
  }
}
