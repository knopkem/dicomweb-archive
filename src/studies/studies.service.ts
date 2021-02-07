import { Injectable } from '@nestjs/common';
import { StudyDto } from './dto/study.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';

@Injectable()
export class StudiesService {
  constructor(
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

  async createFromEntities(study: Study, series: Series, image: Image) {
    const resStudy = await this.studyRepository.save(study);
    series.fkId = resStudy.id;
    const resSeries = await this.seriesRepository.save(series);
    image.fkId = resSeries.id;
    this.imageRepository.save(image);
  }

  findAll(): Promise<Study[]> {
    return this.studyRepository.find();
  }

  findOne(uid: string): Promise<Study[]> {
    return this.studyRepository.find({ where: { uid } });
  }
}
