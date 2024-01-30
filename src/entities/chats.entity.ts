import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Chats {
  @PrimaryGeneratedColumn()
  chat_id: string;

  @Column()
  user_link_1: string;

  @Column()
  user_link_2: string;

  @Column()
  // personal || shared
  type: string;

  @Column()
  name: string;

  @Column()
  avatar_url: string;

  @Column({ default: uuidv4() })
  socket_room_id: string;

  @Column({ nullable: true })
  last_message_id?: string;
}
