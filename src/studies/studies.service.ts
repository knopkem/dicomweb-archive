import { Injectable } from '@nestjs/common';
import { StudyDto } from './dto/study.dto';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';
import { Patient } from './entities/patient.entity';

@Injectable()
export class StudiesService {
  constructor(
    private connection: Connection,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}
  create(studyDto: StudyDto) {
    const study = new Study();
    study.studyInstanceUid = studyDto.uid;
    return this.studyRepository.save(study);
  }

  async createFromEntities(
    patient: Patient,
    study: Study,
    series: Series,
    image: Image,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      patient.fkId = 0;
      let resPatient = await this.patientRepository.findOne({
        where: { patientId: patient.patientId },
      });
      if (!resPatient) {
        resPatient = await queryRunner.manager.save(patient);
      }

      study.fkId = resPatient.id;
      let resStudy = await this.studyRepository.findOne({
        where: { studyInstanceUid: study.studyInstanceUid },
      });
      if (!resStudy) {
        resStudy = await queryRunner.manager.save(study);
      }
      series.fkId = resStudy.id;
      let resSeries = await this.seriesRepository.findOne({
        where: { seriesInstanceUid: series.seriesInstanceUid },
      });
      if (!resSeries) {
        resSeries = await queryRunner.manager.save(series);
      }
      image.fkId = resSeries.id;
      const resImage = await this.imageRepository.findOne({
        where: { sopInstanceUid: image.sopInstanceUid },
      });
      if (!resImage) {
        await queryRunner.manager.save(image);
        await queryRunner.commitTransaction();
      } else {
        console.log('ignoring duplicate image');
      }
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll(): Promise<Study[]> {
    return this.studyRepository.find();
  }

  findOne(uid: string): Promise<Study[]> {
    return this.studyRepository.find({ where: { studyInstanceUid: uid } });
  }

  findMeta(queryContainer: any) {
    return this.patientRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect('patient.studies', 'study')
      .innerJoinAndSelect('study.series', 'series')
      .innerJoinAndSelect('series.images', 'image')
      .where('patient.patientName like :name', { name: '%HEAD%' })
      .andWhere(queryContainer)
      .andWhere('study.studyInstanceUid = :studyuid', {
        studyuid: '1.3.46.670589.5.2.10.2156913941.892665384.993397',
      })
      .andWhere('series.seriesInstanceUid = :seriesuid', {
        seriesuid: '1.3.46.670589.5.2.10.2156913941.892665339.860724',
      })
      .andWhere('image.sopInstanceUid = :imageuid', {
        imageuid: '1.3.46.670589.5.2.10.2156913941.892665339.718742',
      })
      .getMany();
  }
}
