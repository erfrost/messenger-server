import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  image_id: string;

  @Column()
  path: string;
}
