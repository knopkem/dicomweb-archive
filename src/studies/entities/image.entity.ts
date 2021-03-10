import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column({ unique: true })
  uid!: string;

  @Column({ nullable: true })
  instanceNumber!: string;

  @Column({ nullable: true })
  sliceLocation!: string;

  @Column({ nullable: true })
  imageType!: string;

  @Column({ nullable: true })
  numberOfFrames!: string;

  @Column({ nullable: true })
  rows!: number;

  @Column({ nullable: true })
  columns!: number;

  @Column({ nullable: true })
  windowWidth!: string;

  @Column({ nullable: true })
  windowCenter!: string;

  @Column({ nullable: true })
  photometricInterpretation!: string;

  @Column({ nullable: true })
  rescaleSlope!: string;

  @Column({ nullable: true })
  rescaleIntercept!: string;

  @Column({ nullable: true })
  samplesPerPixel!: number;

  @Column({ nullable: true })
  pixelSpacing!: string;

  @Column({ nullable: true })
  bitsAllocated!: number;

  @Column({ nullable: true })
  bitsStored!: number;

  @Column({ nullable: true })
  highBit!: number;

  @Column({ nullable: true })
  pixelRepresentation!: number;

  @Column({ nullable: true })
  imagePositionPatient!: string;

  @Column({ nullable: true })
  imageOrientationPatient!: string;

  @Column({ nullable: true })
  privateFileName!: string;

  @ManyToOne(() => Series, (series) => series.images)
  @JoinColumn({ name: 'fkId' })
  series!: Series;
}
