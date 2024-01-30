import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { Chats } from 'src/entities/chats.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import { Friends } from 'src/entities/friends.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(Chats) private readonly chatRepository: Repository<Chats>,
  ) {}

  async getUser(user_link: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_link,
      },
    });

    delete user.login;
    delete user.password;
    return user;
  }

  async updateUser(user_link: string, dto: UserUpdateDto) {
    const user = await this.userRepository.findOne({ where: { user_link } });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    user.user_link = dto.user_link;
    user.name = dto.name;
    user.surName = dto.surName;
    user.description = dto.description;
    user.family_status = dto.family_status;
    user.city = dto.city;

    const updatedUser = await this.userRepository.save(user);

    delete updatedUser.login;
    delete updatedUser.password;

    return updatedUser;
  }

  async updateAvatar(user_link: string, avatar_url: string) {
    if (!avatar_url) {
      throw new BadRequestException('Изображение не выбрано');
    }

    const user = await this.userRepository.findOne({ where: { user_link } });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    user.avatar_url = avatar_url;

    const updatedUser = await this.userRepository.save(user);

    delete updatedUser.login;
    delete updatedUser.password;

    return updatedUser;
  }

  async getNotifications(user_link: string) {
    if (!user_link) {
      throw new BadRequestException('Пользователь не найден');
    }
    const friendRequests = await this.friendsRepository.find({
      where: {
        friend_link: user_link,
        status: 'pending',
      },
    });

    const result = [];
    await Promise.all(
      friendRequests.map(async (item: Friends) => {
        const user = await this.userRepository.findOne({
          where: {
            user_link: item.user_link,
          },
        });

        if (user) {
          delete user.user_id;
          delete user.login;
          delete user.password;
          delete user.description;
          delete user.family_status;
          delete user.city;
          delete user.age;
          delete user.isOnline;

          result.push(user);
        }
      }),
    );

    return result;
  }

  async changeOnline(user_id: string, isOnline: boolean) {
    await this.userRepository.update({ user_id }, { isOnline });
  }
}
