import { Injectable } from '@nestjs/common';
import { StudyDto } from './dto/study.dto';
import { Repository, Connection, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';
import { Patient } from './entities/patient.entity';
import { getMapping } from './tag.mapping';
import { QUERY_LEVEL, EntityMeta } from './tag.mapping';
import * as dict from 'dicom-data-dictionary';

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
  create(studyDto: StudyDto) {
    const study = new Study();
    study.studyInstanceUid = studyDto.uid;
    return this.studyRepository.save(study);
  }

  async createFromEntities(
    patient: Patient,
    study: Study,
    series: Series,
    image: Image,
  ) {
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
        console.log('ignoring duplicate image');
      }
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll(): Promise<Study[]> {
    return this.studyRepository.find();
  }

  findOne(uid: string): Promise<Study[]> {
    return this.studyRepository.find({ where: { studyInstanceUid: uid } });
  }

  getColumnNames() {
    return getConnection()
      .getMetadata(Patient)
      .ownColumns.map((column) => column.propertyName);
  }

  getTagMapping(tag: string) {
    return getMapping(tag);
  }

  findDicomName(tagId: string): string {
    const dictionary = new dict.DataElementDictionary();
    return dictionary.lookup(tagId)?.name;
  }

  findFromDicomName(tagName: string): string {
    for (const key of Object.keys(dict.standardDataElements)) {
      const value = dict.standardDataElements[key];
      if (value.name === tagName) {
        return key;
      }
    }
    return tagName;
  }

  buildWhereEqual(entity: EntityMeta, value: string): QuerySyntax {
    return new QuerySyntax(
      entity.canonicalColumnName() + ' = :' + entity.column,
      {
        [entity.column]: value,
      },
    );
  }

  buildWhereLike(entity: EntityMeta, value: string): QuerySyntax {
    return new QuerySyntax(
      entity.canonicalColumnName() + ' ILIKE :' + entity.column,
      {
        [entity.column]: this.replaceWildcardCharacters(value),
      },
    );
  }

  splitStringToRange(value: string): string[] {
    const range = value.split('-');
    while (range.length < 2) {
      range.push('');
    }
    return range;
  }

  buildWhereRange(entity: EntityMeta, value: string): QuerySyntax {
    const range = this.splitStringToRange(value);
    return new QuerySyntax(
      entity.canonicalColumnName() + ' BETWEEN :from AND :to',
      {
        from: range[0],
        to: range[1],
      },
    );
  }
  replaceWildcardCharacters(value: string): string {
    const result = value;
    return result
      .replace('*', '%')
      .replace('?', '_')
      .replace('^', '_')
      .replace(' ', '_');
  }

  containsWildcardCharacters(value: string): boolean {
    return (
      value.includes('*') ||
      value.includes('?') ||
      value.includes('^') ||
      value.includes(' ')
    );
  }

  isPatientNameVr(vr: string) {
    return vr === 'PN';
  }

  isDateOrTimeVr(vr: string) {
    return vr === 'DA' || vr === 'TM';
  }

  buildWhereCondition(entity: EntityMeta, value: string): QuerySyntax {
    if (this.isDateOrTimeVr(entity.vr)) {
      return this.buildWhereRange(entity, value);
    }
    if (
      this.isPatientNameVr(entity.vr) &&
      this.containsWildcardCharacters(value)
    ) {
      return this.buildWhereLike(entity, value);
    }
    return this.buildWhereEqual(entity, value);
  }

  createQidoFormat(entity: EntityMeta, value: any) {
    if (!value) {
      value = '';
    }
    if (this.isPatientNameVr(entity.vr)) {
      value = {
        Alphabetic: value,
      };
    }
    return {
      [entity.tag]: {
        Value: [value],
        vr: entity.vr,
      },
    };
  }

  convertToRestModel(select: EntityMeta[], patients: Patient[]) {
    const result = [];
    // TODO: convert to array map
    for (const patient of patients) {
      const row = {};
      for (const entity of select) {
        if (entity.level == QUERY_LEVEL.PATIENT) {
          const value = patient[entity.column];
          const p = this.createQidoFormat(entity, value);
          Object.assign(row, p);
        }
        if (patient.studies) {
          for (const study of patient.studies) {
            if (entity.level == QUERY_LEVEL.STUDY) {
              const value = study[entity.column];
              const p = this.createQidoFormat(entity, value);
              Object.assign(row, p);
            }
            if (study.series) {
              for (const series of study.series) {
                if (entity.level == QUERY_LEVEL.SERIES) {
                  const value = series[entity.column];
                  const p = this.createQidoFormat(entity, value);
                  Object.assign(row, p);
                }
                if (series.images) {
                  for (const image of series.images) {
                    if (entity.level == QUERY_LEVEL.IMAGE) {
                      const value = image[entity.column];
                      const p = this.createQidoFormat(entity, value);
                      Object.assign(row, p);
                    }
                  }
                }
              }
            }
          }
        }
      }
      result.push(row);
    }
    return result;
  }

  async findMeta(tags: Array<DicomTag>, offset: number, limit: number) {
    const conditions = new Array<QuerySyntax>();
    const select = new Array<EntityMeta>();

    let queryLevel = QUERY_LEVEL.PATIENT;
    for (const t of tags) {
      const tagId = this.findFromDicomName(t.key);
      const entity = this.getTagMapping(tagId);
      if (entity) {
        if (t.value !== '') {
          conditions.push(this.buildWhereCondition(entity, t.value));
        }
        select.push(entity);
        if (queryLevel < entity.level) {
          queryLevel = entity.level;
        }
      } else {
        console.log(
          'ignoring unsupported query key: ' +
            t.key +
            ' - ' +
            this.findDicomName(t.key),
        );
      }
    }
    let queryBuilder = this.patientRepository.createQueryBuilder('patient');

    // join tables depending on level
    if (queryLevel >= QUERY_LEVEL.STUDY) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'patient.studies',
        'study',
      );
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
      queryBuilder = queryBuilder.andWhere(
        querySyntax.queryString,
        querySyntax.json,
      );
    }
    const patients = await queryBuilder.getMany();
    return this.convertToRestModel(select, patients);
  }
}
