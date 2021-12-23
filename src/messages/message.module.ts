import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SECRET_KEY, TOKEN_EXPIRES_IN } from '../config/config.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRES_IN },
    }),
  ],
})
export class UsersModule {}
