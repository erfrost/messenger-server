import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  token_id: string;

  @Column()
  user_id: string;

  @Column()
  refresh_token: string;

  @Column()
  access_token: string;
}
