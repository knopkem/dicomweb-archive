import { Injectable } from '@nestjs/common';
import { Study } from 'src/studies/entities/study.entity';
import { StudiesService } from 'src/studies/studies.service';
import { Series } from './../studies/entities/series.entity';
import { Image } from './../studies/entities/image.entity';

@Injectable()
export class FilesService {
  constructor(private readonly studiesService: StudiesService) {}
  import = async () => {
    console.log('importing...');
    const existingStudy = await this.studiesService.findOne('123');
    if (!existingStudy) {
      const study = new Study();
      study.uid = '123';
      const series = new Series();
      series.uid = '321';
      const image = new Image();
      image.uid = '567';
      this.studiesService.createFromEntities(study, series, image);
    }
  };
}
