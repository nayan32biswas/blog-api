import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SECRET_KEY, TOKEN_EXPIRES_IN } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './service/auth.service';

@Module({
  //   imports: [
  //     PassportModule,
  //     JwtModule.register({
  //       secret: SECRET_KEY,
  //       signOptions: { expiresIn: TOKEN_EXPIRES_IN },
  //     }),
  //   ],
  //   controllers: [],
  //   providers: [AuthService, LocalStrategy, JwtStrategy],
  //   exports: [AuthService],
})
export class AuthModule {}
