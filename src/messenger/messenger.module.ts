import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Chats } from 'src/entities/chats.entity';
import { Messages } from 'src/entities/messages.entity';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';
import { MessengerGateway } from './messenger.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Chats, Messages])],
  controllers: [MessengerController],
  providers: [MessengerService, MessengerGateway],
})
export class MessengerModule {}
