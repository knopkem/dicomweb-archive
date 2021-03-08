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

  @Column({ nullable: true })
  instanceNumber!: string;

  @Column({ nullable: true })
  sliceLocation!: string;

  @Column({ nullable: true })
  imageType!: string;

  @Column({ nullable: true })
  numberOfFrames!: string;

  @Column({ nullable: true })
  rows!: string;

  @Column({ nullable: true })
  columns!: string;

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
  samplesPerPixel!: string;

  @Column({ nullable: true })
  pixelSpacing!: string;

  @Column({ nullable: true })
  bitsAllocated!: string;

  @Column({ nullable: true })
  bitsStored!: string;

  @Column({ nullable: true })
  highBit!: string;

  @Column({ nullable: true })
  pixelRepresentation!: string;

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
