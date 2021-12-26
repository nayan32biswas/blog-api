import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SECRET_KEY } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}

// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

// import { SECRET_KEY } from 'src/config/config.service';
// import { UserEntity } from '../users.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(UserEntity)
//     private usersRepository: Repository<UserEntity>,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: SECRET_KEY,
//     });
//   }

//   async validate(payload: any): Promise<UserEntity> {
//     const { username } = payload;

//     const user = await this.usersRepository.findOne({ username: username });
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
