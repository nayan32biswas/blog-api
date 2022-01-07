import { Module } from '@nestjs/common';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { MessagesGateway } from './gateway/messages.gateway';
import { UserEntity } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [MessageController],
  providers: [MessageService, MessagesGateway],
})
export class MessageModule {}
