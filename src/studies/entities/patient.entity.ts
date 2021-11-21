import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Study } from './study.entity';

/**
 * The patient entity/table
 */
@Entity()
export class Patient extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column()
  patientName!: string;

  @Column({ unique: true })
  patientId!: string;

  @Column({ nullable: true })
  patientDob!: string;

  @Column({ nullable: true })
  patientSex!: string;

  @OneToMany(() => Study, (study: Study) => study.patient)
  studies!: Study[];
}
