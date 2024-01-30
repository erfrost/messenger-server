import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  message_id: string;

  @Column()
  chat_id: string;

  @Column()
  sender_link: string;

  @Column()
  recipient_link: string;

  @Column()
  message_content: string;

  @Column()
  date: Date;

  @Column({ type: 'boolean', default: false })
  isDelivered: boolean;
}
