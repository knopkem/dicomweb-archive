import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Study } from './study.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column()
  patientName!: string;

  @Column({ unique: true })
  patientID!: string;

  @Column({ nullable: true })
  patientDob!: string;

  @Column({ nullable: true })
  patientSex!: string;

  @OneToMany(() => Study, (study: Study) => study.patient)
  studies!: Study[];
}
