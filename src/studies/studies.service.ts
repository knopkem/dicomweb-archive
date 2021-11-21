import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StudyDto } from './dto/study.dto';
import { Repository, Connection, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';
import { Patient } from './entities/patient.entity';
import { TagMapSingleton } from './dicom/tag.map';
import { QUERY_LEVEL, PRIVATE_FILENAME } from './dicom/query.level';
import { buildWhereCondition, convertToRestModel } from './sql/query.builder';
import { EntityMeta } from './entities/entity.meta';
import { DicomDict } from './dicom/dicom.dict';

export class DicomTag {
  constructor(public key: string, public value: string = '') {}
}

export class QuerySyntax {
  constructor(public queryString: string, public json: any) {}
}

@Injectable()
export class StudiesService {
  constructor(
    private connection: Connection,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}
  logger = new Logger('StudiesService');

  /**
   * Helper: Returns the EntityMeta object that matches the tag
   * @param tag tag in hex format
   * @returns
   */
  getEntity(tag: string): EntityMeta | undefined {
    try {
      const tagId = DicomDict.canonicalNameToHex(tag);
      return TagMapSingleton.mapToColumn(tagId);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  /**
   * Create a new study in the repository
   * @param studyDto the dto
   * @returns
   */
  create(studyDto: StudyDto): Promise<Study> {
    const study = new Study();
    study.studyInstanceUid = studyDto.uid;
    return this.studyRepository.save(study);
  }

  /**
   * Add new image to database
   * @param patient entity for patient meta
   * @param study entity for study meta
   * @param series entity for series meta
   * @param image entity for image meta
   */
  async createFromEntities(patient: Patient, study: Study, series: Series, image: Image): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      patient.fkId = 0;
      let resPatient = await this.patientRepository.findOne({
        where: { patientId: patient.patientId },
      });
      if (!resPatient) {
        resPatient = await queryRunner.manager.save(patient);
      }

      study.fkId = resPatient.id;
      let resStudy = await this.studyRepository.findOne({
        where: { studyInstanceUid: study.studyInstanceUid },
      });
      if (!resStudy) {
        resStudy = await queryRunner.manager.save(study);
      }
      series.fkId = resStudy.id;
      let resSeries = await this.seriesRepository.findOne({
        where: { seriesInstanceUid: series.seriesInstanceUid },
      });
      if (!resSeries) {
        resSeries = await queryRunner.manager.save(series);
      }
      image.fkId = resSeries.id;
      const resImage = await this.imageRepository.findOne({
        where: { sopInstanceUid: image.sopInstanceUid },
      });
      if (!resImage) {
        await queryRunner.manager.save(image);
        await queryRunner.commitTransaction();
      } else {
        this.logger.verbose('ignoring duplicate image');
      }
    } catch (error) {
      // since we have errors lets rollback the changes we made
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  /**
   * Find all studies in database
   * @returns all studies
   */
  findAll(): Promise<Study[]> {
    return this.studyRepository.find();
  }

  /**
   * Find studies matching study uid
   * @param studyInstanceUid
   * @returns studies found
   */
  findOne(studyInstanceUid: string): Promise<Study[]> {
    return this.studyRepository.find({ where: { studyInstanceUid } });
  }

  /**
   * Find selected meta data about a patient/study/series/image
   * @param tags set of dicom tags
   * @param offset offset into the result data
   * @param limit  truncate result to limit
   * @returns
   */
  async findMeta(tags: Array<DicomTag>, offset: number, limit: number) {
    const conditions = new Array<QuerySyntax>();
    const select = new Array<EntityMeta>();

    let queryLevel = QUERY_LEVEL.PATIENT;
    for (const t of tags) {
      const tagName = t.key;
      const tagValue = t.value;

      const entity = this.getEntity(tagName);
      if (entity) {
        if (t.value) {
          conditions.push(buildWhereCondition(entity, tagValue));
        }
        select.push(entity);
        if (queryLevel < entity.level) {
          queryLevel = entity.level;
        }
      } else {
        this.logger.verbose('ignoring unsupported query key: ' + tagName + ' - ' + DicomDict.hexToCanonicalName(tagName));
      }
    }
    let queryBuilder = this.patientRepository.createQueryBuilder('patient');

    // join tables depending on level
    if (queryLevel >= QUERY_LEVEL.STUDY) {
      queryBuilder = queryBuilder.innerJoinAndSelect('patient.studies', 'study');
    }
    if (queryLevel >= QUERY_LEVEL.SERIES) {
      queryBuilder = queryBuilder.innerJoinAndSelect('study.series', 'series');
    }
    if (queryLevel >= QUERY_LEVEL.IMAGE) {
      queryBuilder = queryBuilder.innerJoinAndSelect('series.images', 'image');
    }

    // for pagination, start at offset
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    // for pagination, limit result
    if (limit !== undefined) {
      queryBuilder.take(limit);
    }

    // add column selection
    for (const entity of select) {
      queryBuilder.addSelect(entity.canonicalColumnName());
    }

    // append where conditions
    for (const querySyntax of conditions) {
      queryBuilder = queryBuilder.andWhere(querySyntax.queryString, querySyntax.json);
    }
    const patients = await queryBuilder.getMany();

    // we want the result in the QIDO REST Model format
    return convertToRestModel(select, patients);
  }

  /**
   * Returns the path to a dicom file stored in the db
   * @param studyUid the StudyInstanceUID
   * @param seriesUid the SeriesInstanceUID
   * @param imageUid the SopInstanceUID
   * @returns
   */
  async getFilepath(studyUid: string, seriesUid: string, imageUid: string) {
    if (!studyUid || !seriesUid || !imageUid) {
      this.logger.error(`missing properties: ${studyUid} / ${seriesUid} / ${imageUid}`);
      throw new NotFoundException();
    }

    const tags: DicomTag[] = [
      new DicomTag('StudyInstanceUID', studyUid),
      new DicomTag('SeriesInstanceUID', seriesUid),
      new DicomTag('SOPInstanceUID', imageUid),
      new DicomTag(PRIVATE_FILENAME, ''),
    ];

    // get filepath via the meta lookup
    const fileMeta = await this.findMeta(tags, 0, 0);
    if (!fileMeta || fileMeta.length === 0) {
      return null;
    }
    // some black magic with any
    const json = fileMeta as any;
    return json[0][PRIVATE_FILENAME]['Value'][0];
  }
}
