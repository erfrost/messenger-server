import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Chats } from 'src/entities/chats.entity';
import { UserGateway } from './user.gateway';
import { Friends } from 'src/entities/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends, Chats])],
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}
