import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Study } from './study.entity';
import { Image } from './image.entity';

/**
 * The Series entity/table
 */
@Entity()
export class Series {
  [key: string]: string | number | Study | Image[];

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column({ unique: true })
  seriesInstanceUid!: string;

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
