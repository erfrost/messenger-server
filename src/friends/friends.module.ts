import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Friends } from 'src/entities/friends.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
