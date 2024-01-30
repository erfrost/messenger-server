import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { Friends } from 'src/entities/friends.entity';
import { FriendRequestDto } from './dto/friend-request.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
  ) {}

  async addFriend(dto: FriendRequestDto) {
    const user_link = dto.user_link;
    const friend_link = dto.friend_link;
    if (!user_link || !friend_link) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isExistFriend = await this.friendsRepository.findOne({
      where: {
        user_link,
        friend_link,
      },
    });
    if (isExistFriend) {
      throw new BadRequestException(
        'Заявка в друзья уже была отправлена ранее',
      );
    }

    const model = this.friendsRepository.create({
      user_link,
      friend_link,
      status: 'pending',
    });

    await this.friendsRepository.save(model);

    return 'Заявка успешно отправлена';
  }

  async getFriendsLinks(user_link: string) {
    if (!user_link) {
      throw new BadRequestException('Пользователь не найден');
    }

    const people = await this.friendsRepository.find({
      where: {
        user_link,
      },
      select: ['friend_link'],
    });

    const result = people.map((item) => item.friend_link);

    return result;
  }

  async updateStatus(user_link: string, friend_link: string, status: string) {
    if (!user_link || !friend_link || !status) {
      throw new BadRequestException('Пользователь не найден');
    }

    const currentFriendRequest = await this.friendsRepository.findOne({
      where: {
        user_link,
        friend_link,
      },
    });
    if (!currentFriendRequest) {
      throw new BadRequestException('Заявка в друзья не существует');
    }
    currentFriendRequest.status = status;

    await this.friendsRepository.save(currentFriendRequest);

    return 'Статус заявки успешно изменён';
  }

  async getFriendsInfo(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const outgoingPeople = await this.friendsRepository.find({
      where: {
        user_link,
        status: 'accepted',
      },
      select: ['friend_link'],
    });
    const incomingPeople = await this.friendsRepository.find({
      where: {
        friend_link: user_link,
        status: 'accepted',
      },
      select: ['user_link'],
    });

    const people = [...outgoingPeople, ...incomingPeople];

    const links = people.map((item) => {
      if (item.friend_link) return item.friend_link;
      else if (item.user_link) return item.user_link;
    });

    const result = await this.userRepository.find({
      where: {
        user_link: In(links),
      },
      select: ['user_link', 'avatar_url', 'name', 'surName'],
    });

    return result;
  }

  async getRequests(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const people = await this.friendsRepository.find({
      where: {
        friend_link: user_link,
        status: 'pending',
      },
      select: ['user_link'],
    });

    const links = people.map((item) => item.user_link);

    const result = await this.userRepository.find({
      where: {
        user_link: In(links),
      },
      select: ['user_link', 'avatar_url', 'name', 'surName'],
    });

    return result;
  }

  async allCancelled(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const requests = await this.friendsRepository.find({
      where: {
        friend_link: user_link,
      },
    });

    requests.map(async (item) => {
      item.status = 'cancelled';
      await this.friendsRepository.save(item);
    });

    return 'Успешно!';
  }

  async getCancelledCount(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const requests = await this.friendsRepository.find({
      where: {
        friend_link: user_link,
        status: 'cancelled',
      },
    });

    return requests.length;
  }

  async getOutgoingCount(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const requests = await this.friendsRepository.find({
      where: {
        user_link,
      },
    });

    return requests.length;
  }
}
