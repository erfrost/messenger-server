import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';

interface GetInfoInterface {
  user_id: string;
  name: string;
  surName: string;
  description: string;
  family_status: string;
  city: string;
  user_link: string;
  age: number;
  isOnline: boolean;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info/:user_link')
  getInfo(@Param('user_link') user_link: string): Promise<GetInfoInterface> {
    return this.userService.getUser(user_link);
  }

  @Post('info/:user_link')
  updateUser(
    @Param('user_link') user_link: string,
    @Body('user') userDto: UserUpdateDto,
  ): Promise<GetInfoInterface> {
    return this.userService.updateUser(user_link, userDto);
  }

  @Post('updateAvatar/:user_link')
  updateAvatar(
    @Param('user_link') user_link: string,
    @Body('avatar_url') avatar_url: string,
  ): Promise<GetInfoInterface> {
    return this.userService.updateAvatar(user_link, avatar_url);
  }

  @Get('notifications/:user_link')
  getNotifications(@Param('user_link') user_link: string): Promise<any> {
    return this.userService.getNotifications(user_link);
  }

  @Post('online/:user_id')
  changeOnline(
    @Param('user_id') user_id: string,
    @Body('isOnline') isOnline: boolean,
  ): Promise<void> {
    return this.userService.changeOnline(user_id, isOnline);
  }
}
