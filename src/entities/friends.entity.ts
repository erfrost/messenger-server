import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn('uuid')
  request_id: string;

  @Column()
  friend_link: string;

  @Column()
  user_link: string;

  @Column()
  status: string;
}
