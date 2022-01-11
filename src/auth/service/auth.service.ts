import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'src/user/user.entity';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async getHashPass(password: string) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ username: username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  createAccessToken(user: UserEntity) {
    const payload = { username: user.username, id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
  createRefreshToken(user: UserEntity) {
    new NotImplementedException('createRefreshToken');

    const payload = { username: user.username, id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt);
  }
}
