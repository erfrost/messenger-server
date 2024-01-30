import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({ unique: true })
  user_link: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ default: 'none' })
  avatar_url: string;

  @Column()
  name: string;

  @Column()
  surName: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  family_status: string;

  @Column({ default: '' })
  city: string;

  @Column()
  age: number;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;
}
