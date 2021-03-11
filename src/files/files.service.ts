import { Injectable } from '@nestjs/common';
import { Patient } from './../studies/entities/patient.entity';
import { Study } from './../studies/entities/study.entity';
import { StudiesService, QuerySyntax } from './../studies/studies.service';
import { Series } from './../studies/entities/series.entity';
import { Image } from './../studies/entities/image.entity';
import * as dicomParser from 'dicom-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { QUERY_LEVEL, EntityMeta } from 'src/studies/tag.mapping';

@Injectable()
export class FilesService {
  constructor(private readonly studiesService: StudiesService) {}

  importDicomFile = async (filename: string) => {
    const data = fs.readFileSync(filename);
    const dataset = dicomParser.parseDicom(data);

    const patient = new Patient();
    patient.patientName = dataset.string('x00100010');
    patient.patientId = dataset.string('x00100020');
    patient.patientDob = dataset.string('x00100030');
    patient.patientSex = dataset.string('x00100040');

    const study = new Study();
    study.studyInstanceUid = dataset.string('x0020000d');
    study.studyDate = dataset.string('x00080020');
    study.studyTime = dataset.string('x00080030');
    study.accessionNumber = dataset.string('x00080050');
    study.referringPhysicianName = dataset.string('x00080090');
    study.studyDescription = dataset.string('x00081030');
    study.nameOfPhysicianReadingStudy = dataset.string('x00081060');
    study.patientAge = dataset.string('x00101010');
    study.patientSize = dataset.string('x00101020');
    study.patientWeight = dataset.string('x00101030');

    const series = new Series();
    series.seriesInstanceUid = dataset.string('x0020000e');
    series.seriesNumber = dataset.string('x00200011');
    series.modality = dataset.string('x00080060');
    series.seriesDescription = dataset.string('x0008103e');
    series.seriesDate = dataset.string('x00080021');
    series.seriesTime = dataset.string('x00080031');
    series.bodyPartExamined = dataset.string('x00180015');
    series.patientPosition = dataset.string('x00185100');
    series.protocolName = dataset.string('x00181030');

    const image = new Image();
    image.sopInstanceUid = dataset.string('x00080018');
    image.instanceNumber = dataset.string('x00200013');
    image.sliceLocation = dataset.string('x00201041');
    image.imageType = dataset.string('x00080008');
    image.numberOfFrames = dataset.string('x00280008');
    image.rows = dataset.uint16('x00280010');
    image.columns = dataset.uint16('x00280011');
    image.windowWidth = dataset.string('x00281051');
    image.windowCenter = dataset.string('x00281050');
    image.photometricInterpretation = dataset.string('x00280004');
    image.rescaleSlope = dataset.string('x00281053');
    image.rescaleIntercept = dataset.string('x00281052');
    image.samplesPerPixel = dataset.uint16('x00280002');
    image.pixelSpacing = dataset.string('x00280030');
    image.bitsAllocated = dataset.uint16('x00280100');
    image.bitsStored = dataset.uint16('x00280101');
    image.highBit = dataset.uint16('x00280102');
    image.pixelRepresentation = dataset.uint16('x00280103');
    image.imagePositionPatient = dataset.string('x00200032');
    image.imageOrientationPatient = dataset.string('x00200037');
    image.privateFileName = filename;

    this.studiesService.createFromEntities(patient, study, series, image);
  };

  import = async () => {
    {
      const filename = path.join(__filename, '../../../import/sample1');
      this.importDicomFile(filename);
    }
    {
      const filename = path.join(__filename, '../../../import/sample2');
      this.importDicomFile(filename);
    }

    {
      const tags = [];
      tags.push({ key: 'PatientID', value: '0009703828' });
      tags.push({ key: '0020000d', value: '' });

      const conditions = new Array<QuerySyntax>();
      const select = new Array<EntityMeta>();

      let queryLevel = QUERY_LEVEL.PATIENT;
      for (const t of tags) {
        const tagId = this.studiesService.findDicomName(t.key);
        const entity = this.studiesService.getTagMapping(tagId);
        if (entity) {
          if (t.value !== '') {
            conditions.push(
              this.studiesService.buildWhereEqual(entity, t.value),
            );
          } else {
            select.push(entity);
          }
          if (queryLevel < entity.level) {
            queryLevel = entity.level;
          }
        } else {
          console.log('ignoring unsupported query key: ' + t.key);
        }
      }

      /*
      query.set('patient.patientId = :patientId', { patientId: '0009703828' });
      query.set('patient.patientName ILIKE :name', { name: '%HeAd%' });
      query.set('study.studyDate BETWEEN :from AND :to', {
        from: '19980414',
        to: '20200101',
      });
      query.set('study.studyInstanceUid = :studyuid', {
        studyuid: '1.3.46.670589.5.2.10.2156913941.892665384.993397',
      });
      query.set('series.seriesInstanceUid = :seriesuid', {
        seriesuid: '1.3.46.670589.5.2.10.2156913941.892665339.860724',
      });
      query.set('image.sopInstanceUid = :imageuid', {
        imageuid: '1.3.46.670589.5.2.10.2156913941.892665339.718742',
      });
      */

      const myPatient = await this.studiesService.findMeta(
        conditions,
        select,
        queryLevel,
      );
      console.log(util.inspect(myPatient, { showHidden: false, depth: null }));
    }
  };
}
