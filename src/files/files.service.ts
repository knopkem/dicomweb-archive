import { Injectable } from '@nestjs/common';
import { Patient } from './../studies/entities/patient.entity';
import { Study } from './../studies/entities/study.entity';
import { StudiesService } from './../studies/studies.service';
import { Series } from './../studies/entities/series.entity';
import { Image } from './../studies/entities/image.entity';

@Injectable()
export class FilesService {
  constructor(private readonly studiesService: StudiesService) {}
  import = async () => {
    console.log('importing...');
    const patient = new Patient();
    patient.patientName = 'test patient';
    patient.patientID = 'patid123';
    const study = new Study();
    study.uid = '123';
    const series = new Series();
    series.uid = '321';
    const image = new Image();
    image.uid = '567';
    this.studiesService.createFromEntities(patient, study, series, image);
  };
}
