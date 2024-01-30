import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { Chats } from 'src/entities/chats.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('messenger')
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @Get('getChats/:user_link')
  getChats(@Param('user_link') user_link: string): Promise<Chats[]> {
    return this.messengerService.getChats(user_link);
  }

  @Get('getChatById/:chat_id')
  getChatById(@Param('chat_id') chat_id: string): Promise<Chats> {
    return this.messengerService.getChatById(chat_id);
  }

  @Post('createChat')
  createChat(@Body() createChatDto: CreateChatDto): Promise<Chats> {
    return this.messengerService.createChat(createChatDto);
  }
}
