import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Series } from './series.entity';

@Unique(['uid'])
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column()
  uid!: string;

  @ManyToOne(() => Series, (series) => series.image)
  @JoinColumn({ name: 'fkId' })
  series!: Series;
}
