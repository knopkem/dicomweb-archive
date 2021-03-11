export class EntityMeta {
  constructor(public table: string, public column: string, public vr: string) {}
}

const patientTable = 'patient';
const studyTable = 'study';
const seriesTable = 'series';
const imageTable = 'image';

export const getMapping = (tag: string) => {
  const mapping = new Map<string, EntityMeta>();
  // patient
  mapping.set('00100010', new EntityMeta(patientTable, 'patientName', 'PN'));
  mapping.set('00100020', new EntityMeta(patientTable, 'patientId', 'LO'));
  mapping.set('00100030', new EntityMeta(patientTable, 'patientDob', 'DA'));
  mapping.set('00100040', new EntityMeta(patientTable, 'patientSex', 'CS'));

  // study
  mapping.set('0020000d', new EntityMeta(studyTable, 'studyInstanceUid', 'UI'));
  mapping.set('00080020', new EntityMeta(studyTable, 'studyDate', 'DA'));
  mapping.set('00080030', new EntityMeta(studyTable, 'studyTime', 'TM'));
  mapping.set('00080050', new EntityMeta(studyTable, 'accessionNumber', 'SH'));
  mapping.set(
    '00080090',
    new EntityMeta(studyTable, 'referringPhysicianName', 'PN'),
  );
  mapping.set('00081030', new EntityMeta(studyTable, 'studyDescription', 'LO'));
  mapping.set(
    '00081060',
    new EntityMeta(studyTable, 'nameOfPhysicianReadingStudy', 'PN'),
  );
  mapping.set('00101010', new EntityMeta(studyTable, 'patientAge', 'AS'));
  mapping.set('00101020', new EntityMeta(studyTable, 'patientSize', 'DS'));
  mapping.set('00101030', new EntityMeta(studyTable, 'patientWeight', 'DS'));

  // series
  mapping.set(
    '0020000e',
    new EntityMeta(seriesTable, 'seriesInstanceUid', 'UI'),
  );
  mapping.set('00200011', new EntityMeta(seriesTable, 'seriesNumber', 'IS'));
  mapping.set('00080060', new EntityMeta(seriesTable, 'modality', 'CS'));
  mapping.set(
    '0008103e',
    new EntityMeta(seriesTable, 'seriesDescription', 'LO'),
  );
  mapping.set('00080021', new EntityMeta(seriesTable, 'seriesDate', 'DA'));
  mapping.set('00080031', new EntityMeta(seriesTable, 'seriesTime', 'TM'));
  mapping.set(
    '00180015',
    new EntityMeta(seriesTable, 'bodyPartExamined', 'CS'),
  );
  mapping.set('00185100', new EntityMeta(seriesTable, 'patientPosition', 'CS'));
  mapping.set('00181030', new EntityMeta(seriesTable, 'protocolName', 'LO'));

  // image
  mapping.set('00080018', new EntityMeta(imageTable, 'sopInstanceUid', 'UI'));
  mapping.set('00200013', new EntityMeta(imageTable, 'instanceNumber', 'IS'));
  mapping.set('00201041', new EntityMeta(imageTable, 'sliceLocation', 'DS'));
  mapping.set('00080008', new EntityMeta(imageTable, 'imageType', 'CS'));
  mapping.set('00280008', new EntityMeta(imageTable, 'numberOfFrames', 'IS'));
  mapping.set('00280010', new EntityMeta(imageTable, 'rows', 'US'));
  mapping.set('00280011', new EntityMeta(imageTable, 'columns', 'US'));
  mapping.set('00281051', new EntityMeta(imageTable, 'windowWidth', 'DS'));
  mapping.set('00281050', new EntityMeta(imageTable, 'windowCenter', 'DS'));
  mapping.set(
    '00280004',
    new EntityMeta(imageTable, 'photometricInterpretation', 'CS'),
  );
  mapping.set('00281053', new EntityMeta(imageTable, 'rescaleSlope', 'DS'));
  mapping.set('00281052', new EntityMeta(imageTable, 'rescaleIntercept', 'DS'));
  mapping.set('00280002', new EntityMeta(imageTable, 'samplesPerPixel', 'US'));
  mapping.set('00280030', new EntityMeta(imageTable, 'pixelSpacing', 'DS'));
  mapping.set('00280100', new EntityMeta(imageTable, 'bitsAllocated', 'US'));
  mapping.set('00280101', new EntityMeta(imageTable, 'bitsStored', 'US'));
  mapping.set('00280102', new EntityMeta(imageTable, 'highBit', 'US'));
  mapping.set(
    '00280103',
    new EntityMeta(imageTable, 'pixelRepresentation', 'US'),
  );
  mapping.set(
    '00200032',
    new EntityMeta(imageTable, 'imagePositionPatient', 'DS'),
  );
  mapping.set(
    '00200037',
    new EntityMeta(imageTable, 'imageOrientationPatient', 'DS'),
  );

  // private
  mapping.set('00110011', new EntityMeta(imageTable, 'privateFileName', 'CS'));
  return mapping.get(tag);
};
