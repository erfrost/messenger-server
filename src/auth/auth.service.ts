import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { decodePassword, encodePassword } from 'utils/bcrypt';
import { SignUpUserDto } from './dto/signUp-user.dto';
import { TokenService } from './token.service';
import { SignInUserDto } from './dto/signIn-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: SignUpUserDto) {
    if (
      !dto.login ||
      !dto.password ||
      !dto.name ||
      !dto.surName ||
      !dto.user_link ||
      !dto.age
    ) {
      throw new BadRequestException('Не все поля заполнены');
    }

    const existUser = await this.userRepository.findOne({
      where: { login: dto.login },
    });
    if (existUser) {
      throw new BadRequestException(
        'Пользователь с этим логином уже зарегестрирован',
      );
    }

    const password = await encodePassword(dto.password);

    const model = this.userRepository.create({
      login: dto.login,
      password: password,
      name: dto.name,
      surName: dto.surName,
      user_link: dto.user_link,
      age: dto.age,
    });
    const newUser = await this.userRepository.save(model);

    const tokens = await this.tokenService.generate({
      user_id: newUser.user_id,
    });

    await this.tokenService.save(
      tokens.access_token,
      tokens.refresh_token,
      newUser.user_id,
    );

    return {
      ...tokens,
      user_id: newUser.user_id,
      user_link: newUser.user_link,
    };
  }

  async signIn(dto: SignInUserDto) {
    const currentUser = await this.userRepository.findOne({
      where: {
        login: dto.login,
      },
    });
    if (!currentUser || !decodePassword(dto.password, currentUser.password))
      throw new BadRequestException('Неверное имя пользователя или пароль');

    const tokens = await this.tokenService.generate({
      user_id: currentUser.user_id,
    });

    await this.tokenService.save(
      tokens.access_token,
      tokens.refresh_token,
      currentUser.user_id,
    );

    return {
      ...tokens,
      user_id: currentUser.user_id,
      user_link: currentUser.user_link,
    };
  }
}
