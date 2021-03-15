import { Injectable, Logger } from '@nestjs/common';
import { Patient } from './../studies/entities/patient.entity';
import { Study } from './../studies/entities/study.entity';
import { StudiesService, DicomTag } from './../studies/studies.service';
import { Series } from './../studies/entities/series.entity';
import { Image } from './../studies/entities/image.entity';
import * as dicomParser from 'dicom-parser';
import * as fs from 'fs';
import * as util from 'util';
import * as rra from 'recursive-readdir-async';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly studiesService: StudiesService) {}
  logger = new Logger('FilesService');

  importDicomFile = async (filename: string) => {
    this.logger.verbose('importing: ' + filename);
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
    study.studyId = dataset.string('x00200010');
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
    image.sopClassUid = dataset.string('x0008,0016');
    image.instanceNumber = dataset.string('x00200013');
    image.sliceLocation = dataset.string('x00201041');
    image.imageType = dataset.string('x00080008');
    image.referencedFrameNumber = dataset.string('x00081160');
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
    image.privateFileName = filename.replace(/\\/g, '/');

    await this.studiesService.createFromEntities(patient, study, series, image);
  };

  import = async () => {
    {
      try {
        const directory = path.join(__filename, '../../../import');
        const files = await rra.list(directory);
        for (const file of files) {
          if (!file.isDirectory) {
            await this.importDicomFile(file.fullname);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
}
