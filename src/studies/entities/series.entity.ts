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

  @Column({ nullable: true })
  seriesNumber!: string;

  @Column({ nullable: true })
  modality!: string;

  @Column({ nullable: true })
  seriesDescription!: string;

  @Column({ nullable: true })
  seriesDate!: string;

  @Column({ nullable: true })
  seriesTime!: string;

  @Column({ nullable: true })
  bodyPartExamined!: string;

  @Column({ nullable: true })
  patientPosition!: string;

  @Column({ nullable: true })
  protocolName!: string;

  @ManyToOne(() => Study, (study) => study.series)
  @JoinColumn({ name: 'fkId' })
  study!: Study;

  @OneToMany(() => Image, (image: Image) => image.series)
  images!: Image[];
}
