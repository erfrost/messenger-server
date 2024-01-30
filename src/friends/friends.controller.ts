import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendRequestDto } from './dto/friend-request.dto';
import { UpdateStatusRequestDto } from './dto/update-status-request.dto';
import { FriendDto } from './dto/friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('getFriendsInfo/:user_link')
  getFriendsInfo(@Param('user_link') user_link: string): Promise<FriendDto[]> {
    return this.friendsService.getFriendsInfo(user_link);
  }

  @Get('getFriendsLinks/:user_link')
  getFriendsLinks(@Param('user_link') user_link: string): Promise<string[]> {
    return this.friendsService.getFriendsLinks(user_link);
  }

  @Post('addFriend')
  addFriend(@Body() friendRequestDto: FriendRequestDto): Promise<string> {
    return this.friendsService.addFriend(friendRequestDto);
  }

  @Post('updateStatus')
  updateStatus(
    @Body() updateStatusRequestDto: UpdateStatusRequestDto,
  ): Promise<string> {
    console.log(updateStatusRequestDto);
    return this.friendsService.updateStatus(
      updateStatusRequestDto.user_link,
      updateStatusRequestDto.friend_link,
      updateStatusRequestDto.status,
    );
  }

  @Get('getRequests/:user_link')
  getRequests(@Param('user_link') user_link: string): Promise<FriendDto[]> {
    return this.friendsService.getRequests(user_link);
  }

  @Get('getCancelledCount/:user_link')
  getCancelledCount(@Param('user_link') user_link: string): Promise<any> {
    return this.friendsService.getCancelledCount(user_link);
  }

  @Get('getOutgoingCount/:user_link')
  getOutgoingCount(@Param('user_link') user_link: string): Promise<number> {
    return this.friendsService.getOutgoingCount(user_link);
  }

  @Post('allCancelled/:user_link')
  allCancelled(@Param('user_link') user_link: string): Promise<string> {
    return this.friendsService.allCancelled(user_link);
  }
}
