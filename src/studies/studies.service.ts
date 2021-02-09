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
    /*
    const resStudy = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Study)
      .values(study)
      .orUpdate({ conflict_target: ['id', 'uid'], overwrite: [] })
      .execute();

    series.fkId = resStudy.identifiers['id'];
    const resSeries = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Series)
      .values(series)
      .orUpdate({ conflict_target: ['id', 'uid'], overwrite: [] })
      .execute();

    image.fkId = resSeries.identifiers['id'];
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Image)
      .values(image)
      .orUpdate({ conflict_target: ['id', 'uid'], overwrite: [] })
      .execute();
      */

    let resStudy = await this.studyRepository.findOne(study);
    if (resStudy === undefined) {
      resStudy = await this.studyRepository.save(study);
    }
    console.log('res', resStudy);
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
