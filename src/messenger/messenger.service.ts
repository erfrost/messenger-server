import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { Chats } from 'src/entities/chats.entity';
import { Messages } from 'src/entities/messages.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessengerService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Chats) private readonly chatRepository: Repository<Chats>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  async getChats(user_link: string) {
    if (!user_link) throw new BadRequestException('Пользователь не найден');

    const chats = await this.chatRepository.find({
      where: {
        user_link_1: user_link,
      },
    });

    return chats;
  }

  async getChatById(chat_id: string) {
    if (!chat_id) throw new BadRequestException('Чат не найден');

    const chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });

    return chat;
  }

  async createChat(dto: CreateChatDto) {
    if (!dto.user_link || !dto.friend_link)
      throw new BadRequestException('Пользователь не найден');

    const friend = await this.userRepository.findOne({
      where: {
        user_link: dto.friend_link,
      },
      select: ['name', 'surName', 'avatar_url'],
    });

    if (!friend) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isExistChat = await this.chatRepository.findOne({
      where: {
        user_link_1: dto.user_link,
        user_link_2: dto.friend_link,
      },
    });

    if (isExistChat) {
      throw new BadRequestException('Чат уже существует');
    }

    const model = this.chatRepository.create({
      user_link_1: dto.user_link,
      user_link_2: dto.friend_link,
      type: 'personal',
      avatar_url: friend.avatar_url,
      name: friend.name + ' ' + friend.surName,
    });

    const newChat = await this.chatRepository.save(model);

    return newChat;
  }

  async sendMessage(dto: SendMessageDto) {
    const {
      chat_id,
      sender_link,
      recipient_link,
      message_content,
      date,
      socket_room_id,
    } = dto;
    if (
      !chat_id ||
      !sender_link ||
      !recipient_link ||
      !message_content ||
      !date ||
      !socket_room_id
    ) {
      throw new BadRequestException('Неверные параметры запроса');
    }

    const currentChat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!currentChat) throw new BadRequestException('Чат не существует');

    const model = this.messagesRepository.create({
      chat_id,
      sender_link,
      recipient_link,
      message_content,
      date,
    });

    const newMessage = await this.messagesRepository.save(model);

    currentChat.last_message_id = newMessage.message_id;
    await this.chatRepository.save(currentChat);

    return newMessage;
  }
}
