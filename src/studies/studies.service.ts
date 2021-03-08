import { Injectable } from '@nestjs/common';
import { StudyDto } from './dto/study.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';
import { Patient } from './entities/patient.entity';

@Injectable()
export class StudiesService {
  constructor(
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
    study.uid = studyDto.uid;
    return this.studyRepository.save(study);
  }

  async createFromEntities(
    patient: Patient,
    study: Study,
    series: Series,
    image: Image,
  ) {
    patient.fkId = 0;
    let resPatient = await this.patientRepository.findOne(patient);
    if (!resPatient) {
      resPatient = await this.patientRepository.save(patient);
    }

    study.fkId = resPatient.id;
    let resStudy = await this.studyRepository.findOne(study);
    if (!resStudy) {
      resStudy = await this.studyRepository.save(study);
    }
    series.fkId = resStudy.id;
    let resSeries = await this.seriesRepository.findOne(series);
    if (!resSeries) {
      resSeries = await this.seriesRepository.save(series);
    }
    image.fkId = resSeries.id;
    const resImage = await this.imageRepository.findOne(image);
    if (!resImage) {
      this.imageRepository.save(image);
    } else {
      console.log('ignoring duplicate image');
    }
  }

  findAll(): Promise<Study[]> {
    return this.studyRepository.find();
  }

  findOne(uid: string): Promise<Study[]> {
    return this.studyRepository.find({ where: { uid } });
  }
}
