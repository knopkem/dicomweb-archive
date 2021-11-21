import { Column, Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Patient } from './patient.entity';
import { Series } from './series.entity';

/**
 * The Study entity/table
 */
@Entity()
export class Study {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column({ unique: true })
  studyInstanceUid!: string;

  @Column({ nullable: true })
  studyDate!: string;

  @Column({ nullable: true })
  studyTime!: string;

  @Column({ nullable: true })
  studyId!: string;

  @Column({ nullable: true })
  accessionNumber!: string;

  @Column({ nullable: true })
  referringPhysicianName!: string;

  @Column({ nullable: true })
  studyDescription!: string;

  @Column({ nullable: true })
  nameOfPhysicianReadingStudy!: string;

  @Column({ nullable: true })
  patientAge!: string;

  @Column({ nullable: true })
  patientSize!: string;

  @Column({ nullable: true })
  patientWeight!: string;

  @ManyToOne(() => Patient, (patient) => patient.studies)
  @JoinColumn({ name: 'fkId' })
  patient!: Patient;

  @OneToMany(() => Series, (series: Series) => series.study)
  series!: Series[];
}
