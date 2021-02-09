import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Study } from './study.entity';
import { Image } from './image.entity';

@Unique(['uid'])
@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column()
  uid!: string;

  @ManyToOne(() => Study, (study) => study.series)
  @JoinColumn({ name: 'fkId' })
  study!: Study;

  @OneToMany(() => Image, (image: Image) => image.series)
  image!: Image[];
}
