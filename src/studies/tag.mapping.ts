export enum QUERY_LEVEL {
  PATIENT = 0,
  STUDY = 1,
  SERIES = 2,
  IMAGE = 3,
}

export class EntityMeta {
  constructor(
    public level: QUERY_LEVEL,
    public column: string,
    public vr: string,
    public tag: string = '',
  ) {}

  public static tableNameForQueryLevel(level: QUERY_LEVEL): string {
    switch (level) {
      case QUERY_LEVEL.PATIENT:
        return 'patient';
      case QUERY_LEVEL.STUDY:
        return 'study';
      case QUERY_LEVEL.SERIES:
        return 'series';
      case QUERY_LEVEL.IMAGE:
        return 'image';
    }
  }
  canonicalColumnName(): string {
    return EntityMeta.tableNameForQueryLevel(this.level) + '.' + this.column;
  }
}

export const getMapping = (tag: string) => {
  const mapping = new Map<string, EntityMeta>();
  // patient
  mapping.set(
    '00100010',
    new EntityMeta(QUERY_LEVEL.PATIENT, 'patientName', 'PN'),
  );
  mapping.set(
    '00100020',
    new EntityMeta(QUERY_LEVEL.PATIENT, 'patientId', 'LO'),
  );
  mapping.set(
    '00100030',
    new EntityMeta(QUERY_LEVEL.PATIENT, 'patientDob', 'DA'),
  );
  mapping.set(
    '00100040',
    new EntityMeta(QUERY_LEVEL.PATIENT, 'patientSex', 'CS'),
  );

  // study
  mapping.set(
    '0020000d',
    new EntityMeta(QUERY_LEVEL.STUDY, 'studyInstanceUid', 'UI'),
  );
  mapping.set('00080020', new EntityMeta(QUERY_LEVEL.STUDY, 'studyDate', 'DA'));
  mapping.set('00080030', new EntityMeta(QUERY_LEVEL.STUDY, 'studyTime', 'TM'));
  mapping.set(
    '00080050',
    new EntityMeta(QUERY_LEVEL.STUDY, 'accessionNumber', 'SH'),
  );
  mapping.set(
    '00080090',
    new EntityMeta(QUERY_LEVEL.STUDY, 'referringPhysicianName', 'PN'),
  );
  mapping.set(
    '00081030',
    new EntityMeta(QUERY_LEVEL.STUDY, 'studyDescription', 'LO'),
  );
  mapping.set(
    '00081060',
    new EntityMeta(QUERY_LEVEL.STUDY, 'nameOfPhysicianReadingStudy', 'PN'),
  );
  mapping.set(
    '00101010',
    new EntityMeta(QUERY_LEVEL.STUDY, 'patientAge', 'AS'),
  );
  mapping.set(
    '00101020',
    new EntityMeta(QUERY_LEVEL.STUDY, 'patientSize', 'DS'),
  );
  mapping.set(
    '00101030',
    new EntityMeta(QUERY_LEVEL.STUDY, 'patientWeight', 'DS'),
  );

  // series
  mapping.set(
    '0020000e',
    new EntityMeta(QUERY_LEVEL.SERIES, 'seriesInstanceUid', 'UI'),
  );
  mapping.set(
    '00200011',
    new EntityMeta(QUERY_LEVEL.SERIES, 'seriesNumber', 'IS'),
  );
  mapping.set('00080060', new EntityMeta(QUERY_LEVEL.SERIES, 'modality', 'CS'));
  mapping.set(
    '0008103e',
    new EntityMeta(QUERY_LEVEL.SERIES, 'seriesDescription', 'LO'),
  );
  mapping.set(
    '00080021',
    new EntityMeta(QUERY_LEVEL.SERIES, 'seriesDate', 'DA'),
  );
  mapping.set(
    '00080031',
    new EntityMeta(QUERY_LEVEL.SERIES, 'seriesTime', 'TM'),
  );
  mapping.set(
    '00180015',
    new EntityMeta(QUERY_LEVEL.SERIES, 'bodyPartExamined', 'CS'),
  );
  mapping.set(
    '00185100',
    new EntityMeta(QUERY_LEVEL.SERIES, 'patientPosition', 'CS'),
  );
  mapping.set(
    '00181030',
    new EntityMeta(QUERY_LEVEL.SERIES, 'protocolName', 'LO'),
  );

  // image
  mapping.set(
    '00080018',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'sopInstanceUid', 'UI'),
  );
  mapping.set(
    '00200013',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'instanceNumber', 'IS'),
  );
  mapping.set(
    '00201041',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'sliceLocation', 'DS'),
  );
  mapping.set('00080008', new EntityMeta(QUERY_LEVEL.IMAGE, 'imageType', 'CS'));
  mapping.set(
    '00280008',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'numberOfFrames', 'IS'),
  );
  mapping.set('00280010', new EntityMeta(QUERY_LEVEL.IMAGE, 'rows', 'US'));
  mapping.set('00280011', new EntityMeta(QUERY_LEVEL.IMAGE, 'columns', 'US'));
  mapping.set(
    '00281051',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'windowWidth', 'DS'),
  );
  mapping.set(
    '00281050',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'windowCenter', 'DS'),
  );
  mapping.set(
    '00280004',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'photometricInterpretation', 'CS'),
  );
  mapping.set(
    '00281053',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'rescaleSlope', 'DS'),
  );
  mapping.set(
    '00281052',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'rescaleIntercept', 'DS'),
  );
  mapping.set(
    '00280002',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'samplesPerPixel', 'US'),
  );
  mapping.set(
    '00280030',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'pixelSpacing', 'DS'),
  );
  mapping.set(
    '00280100',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'bitsAllocated', 'US'),
  );
  mapping.set(
    '00280101',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'bitsStored', 'US'),
  );
  mapping.set('00280102', new EntityMeta(QUERY_LEVEL.IMAGE, 'highBit', 'US'));
  mapping.set(
    '00280103',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'pixelRepresentation', 'US'),
  );
  mapping.set(
    '00200032',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'imagePositionPatient', 'DS'),
  );
  mapping.set(
    '00200037',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'imageOrientationPatient', 'DS'),
  );

  // private
  mapping.set(
    '00110011',
    new EntityMeta(QUERY_LEVEL.IMAGE, 'privateFileName', 'CS'),
  );
  const entity = mapping.get(tag.toLowerCase());
  if (entity) {
    entity.tag = tag;
  }
  return entity;
};
