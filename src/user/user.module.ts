import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SECRET_KEY, TOKEN_EXPIRES_IN } from '../config/config.service';
import { UserEntity } from './user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LocalStrategy } from '../auth/strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
