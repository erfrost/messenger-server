import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async searchUsers(text: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :searchText', { searchText: `%${text}%` })
      .orWhere('user.surName LIKE :searchText', { searchText: `%${text}%` })
      .getMany();

    const result = users.map((user: Users) => {
      delete user.user_id;
      delete user.login;
      delete user.password;
      delete user.description;
      delete user.family_status;
      delete user.city;
      delete user.age;
      delete user.isOnline;
      return user;
    });

    return result;
  }
}
