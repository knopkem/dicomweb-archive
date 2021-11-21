import { EntityMeta } from '../entities/entity.meta';
import { QUERY_LEVEL, PRIVATE_FILENAME } from './quer.level';


export class TagMap {
  map = new Map<string, EntityMeta>([
    // patient
    ['00100010', new EntityMeta(QUERY_LEVEL.PATIENT, 'patientName', 'PN')],
    ['00100020', new EntityMeta(QUERY_LEVEL.PATIENT, 'patientId', 'LO')],
    ['00100030', new EntityMeta(QUERY_LEVEL.PATIENT, 'patientDob', 'DA')],
    ['00100040', new EntityMeta(QUERY_LEVEL.PATIENT, 'patientSex', 'CS')],

    // study
    ['0020000d', new EntityMeta(QUERY_LEVEL.STUDY, 'studyInstanceUid', 'UI')],
    ['00080020', new EntityMeta(QUERY_LEVEL.STUDY, 'studyDate', 'DA')],
    ['00080030', new EntityMeta(QUERY_LEVEL.STUDY, 'studyTime', 'TM')],
    ['00200010', new EntityMeta(QUERY_LEVEL.STUDY, 'studyId', 'SH')],
    ['00080050', new EntityMeta(QUERY_LEVEL.STUDY, 'accessionNumber', 'SH')],
    ['00080090', new EntityMeta(QUERY_LEVEL.STUDY, 'referringPhysicianName', 'PN')],
    ['00081030', new EntityMeta(QUERY_LEVEL.STUDY, 'studyDescription', 'LO')],
    ['00081060', new EntityMeta(QUERY_LEVEL.STUDY, 'nameOfPhysicianReadingStudy', 'PN')],
    ['00101010', new EntityMeta(QUERY_LEVEL.STUDY, 'patientAge', 'AS')],
    ['00101020', new EntityMeta(QUERY_LEVEL.STUDY, 'patientSize', 'DS')],
    ['00101030', new EntityMeta(QUERY_LEVEL.STUDY, 'patientWeight', 'DS')],

    // series
    ['0020000e', new EntityMeta(QUERY_LEVEL.SERIES, 'seriesInstanceUid', 'UI')],
    ['00200011', new EntityMeta(QUERY_LEVEL.SERIES, 'seriesNumber', 'IS')],
    ['00080060', new EntityMeta(QUERY_LEVEL.SERIES, 'modality', 'CS')],
    ['0008103e', new EntityMeta(QUERY_LEVEL.SERIES, 'seriesDescription', 'LO')],
    ['00080021', new EntityMeta(QUERY_LEVEL.SERIES, 'seriesDate', 'DA')],
    ['00080031', new EntityMeta(QUERY_LEVEL.SERIES, 'seriesTime', 'TM')],
    ['00180015', new EntityMeta(QUERY_LEVEL.SERIES, 'bodyPartExamined', 'CS')],
    ['00185100', new EntityMeta(QUERY_LEVEL.SERIES, 'patientPosition', 'CS')],
    ['00181030', new EntityMeta(QUERY_LEVEL.SERIES, 'protocolName', 'LO')],

    // image
    ['00080018', new EntityMeta(QUERY_LEVEL.IMAGE, 'sopInstanceUid', 'UI')],
    ['00080016', new EntityMeta(QUERY_LEVEL.IMAGE, 'sopClassUid', 'UI')],
    ['00200013', new EntityMeta(QUERY_LEVEL.IMAGE, 'instanceNumber', 'IS')],
    ['00201041', new EntityMeta(QUERY_LEVEL.IMAGE, 'sliceLocation', 'DS')],
    ['00080008', new EntityMeta(QUERY_LEVEL.IMAGE, 'imageType', 'CS')],
    ['00280008', new EntityMeta(QUERY_LEVEL.IMAGE, 'numberOfFrames', 'IS')],
    ['00081160', new EntityMeta(QUERY_LEVEL.IMAGE, 'referencedFrameNumber', 'IS')],
    ['00280010', new EntityMeta(QUERY_LEVEL.IMAGE, 'rows', 'US')],
    ['00280011', new EntityMeta(QUERY_LEVEL.IMAGE, 'columns', 'US')],
    ['00281051', new EntityMeta(QUERY_LEVEL.IMAGE, 'windowWidth', 'DS')],
    ['00281050', new EntityMeta(QUERY_LEVEL.IMAGE, 'windowCenter', 'DS')],
    ['00280004', new EntityMeta(QUERY_LEVEL.IMAGE, 'photometricInterpretation', 'CS')],
    ['00281053', new EntityMeta(QUERY_LEVEL.IMAGE, 'rescaleSlope', 'DS')],
    ['00281052', new EntityMeta(QUERY_LEVEL.IMAGE, 'rescaleIntercept', 'DS')],
    ['00280002', new EntityMeta(QUERY_LEVEL.IMAGE, 'samplesPerPixel', 'US')],
    ['00280030', new EntityMeta(QUERY_LEVEL.IMAGE, 'pixelSpacing', 'DS')],
    ['00280100', new EntityMeta(QUERY_LEVEL.IMAGE, 'bitsAllocated', 'US')],
    ['00280101', new EntityMeta(QUERY_LEVEL.IMAGE, 'bitsStored', 'US')],
    ['00280102', new EntityMeta(QUERY_LEVEL.IMAGE, 'highBit', 'US')],
    ['00280103', new EntityMeta(QUERY_LEVEL.IMAGE, 'pixelRepresentation', 'US')],
    ['00200032', new EntityMeta(QUERY_LEVEL.IMAGE, 'imagePositionPatient', 'DS')],
    ['00200037', new EntityMeta(QUERY_LEVEL.IMAGE, 'imageOrientationPatient', 'DS')],

    // private
    [PRIVATE_FILENAME, new EntityMeta(QUERY_LEVEL.IMAGE, 'privateFileName', 'CS')],
  ]);

  mapToColumn(tag: string): EntityMeta {
    let entity = this.map.get(tag.toLowerCase());
    if (!entity) throw new Error('Mapping failed');
    entity.tag = tag;
    return entity;
  }
}

export class TagMapSingleton {
  static mapper = new TagMap();
  static mapToColumn(tag: string): EntityMeta {
    return this.mapper.mapToColumn(tag);
  }
}
