import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Study } from './study.entity';

@Unique(['patientID'])
@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column()
  patientName!: string;

  @Column()
  patientID!: string;

  @Column({ nullable: true })
  patientDob!: string;

  @Column({ nullable: true })
  patientSex!: string;

  @OneToMany(() => Study, (study: Study) => study.patient)
  studies!: Study[];
}
