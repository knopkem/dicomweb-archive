import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Series } from './series.entity';

@Unique(['uid'])
@Entity()
export class Study {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  uid!: string;

  @OneToMany(() => Series, (series: Series) => series.study)
  series!: Series[];
}
