import { Patient } from '../entities/patient.entity';
import { EntityMeta } from '../entities/entity.meta';
import { QuerySyntax } from '../studies.service';
import { QUERY_LEVEL } from '../dicom/query.level';


type RangeType = {
  from: string,
  to: string,
}

/**
 * Helper to split a range value string to range object
 * @param value 
 * @returns 
 */
export function splitStringToRange(value: string): RangeType {
  const range = value.split('-');
  const from = range.length > 0 ? range[0] : '';
  const to = range.length > 1 ? range[1] : '';
  return {
    from,
    to
  }
}

/**
 * Build a query syntax with equality operator
 * @param entity 
 * @param value 
 * @returns 
 */
export function buildWhereEqual(entity: EntityMeta, value: string): QuerySyntax {
  return new QuerySyntax(entity.canonicalColumnName() + ' = :' + entity.column, {
    [entity.column]: value,
  });
}

/**
 * Build a query syntax to partially match strings values
 * @param entity 
 * @param value 
 * @returns 
 */
export function buildWhereLike(entity: EntityMeta, value: string): QuerySyntax {
  return new QuerySyntax(entity.canonicalColumnName() + ' ILIKE :' + entity.column, {
    [entity.column]: replaceWildcardCharacters(value),
  });
}

/**
 * Bild a query syntax for date/time ranges
 * @param entity the entity
 * @param value a DICOM range string with '-' separator
 * @returns QuerySyntax
 */
export function buildWhereRange(entity: EntityMeta, value: string): QuerySyntax {
  const range = splitStringToRange(value);
  return new QuerySyntax(entity.canonicalColumnName() + ' BETWEEN :from AND :to', range);
}

/**
 * DICOM wildcard to SQL wildcard formatting
 * @param value the original value
 * @returns the update value
 */
export function replaceWildcardCharacters(value: string): string {
  return value.replace('*', '%').replace('?', '_').replace('^', '_').replace(' ', '_');
}

/**
 * Check if value contains DICOM wildcards
 * @param value the value
 * @returns boolean
 */
export function containsWildcardCharacters(value: string): boolean {
  return value.includes('*') || value.includes('?') || value.includes('^') || value.includes(' ');
}

/**
 * Build where condition based on VR types
 * @param entity the entity
 * @param value the value
 * @returns QuerySyntax
 */
export function buildWhereCondition(entity: EntityMeta, value: string): QuerySyntax {
  if (entity.isDateOrTimeVr()) {
    return buildWhereRange(entity, value);
  }
  if (entity.isPatientNameVr() && containsWildcardCharacters(value)) {
    return buildWhereLike(entity, value);
  }
  return buildWhereEqual(entity, value);
}

/**
 * Create Entity to QIDO format
 * @param entity 
 * @param value 
 * @returns 
 */
function createQidoFormat(entity: EntityMeta, value: any) {
  if (!value) {
    value = '';
  }
  if (entity.isPatientNameVr()) {
    value = {
      Alphabetic: value,
    };
  }
  let newValue = [value];
  if (entity.isStringTypeVr()) {
    const stringValue = value as string;
    newValue = stringValue.split('\\');
    if (entity.isStringTypeIntVr()) {
      newValue = newValue.map((elem: string) => parseInt(elem));
    } else if (entity.isStringTypeFloatVr()) {
      newValue = newValue.map((elem: string) => parseFloat(elem));
    }
  }
  return {
    [entity.tag]: {
      Value: newValue,
      vr: entity.vr,
    },
  };
}

/**
 * Build json from QIDO results
 * @param entity an entity
 * @param select array of EntityMeta
 * @param level the query level
 * @returns json object
 */
function getProperties(entity: any, select: EntityMeta[], level: QUERY_LEVEL) {
  const row = {};
  for (const e of select) {
    if (e.level !== level) continue;
    const value = entity[e.column];
    const p = createQidoFormat(e, value);
    Object.assign(row, p);
  }
  return row;
}

/**
 * Converts the result to QIDO REST Model
 * @param select 
 * @param patients 
 * @returns 
 */
export function convertToRestModel(select: EntityMeta[], patients: Patient[]) {
  const result = [];

  for (const patient of patients) {
    const pRow = getProperties(patient, select, QUERY_LEVEL.PATIENT);
    if (!patient.studies) {
      result.push(pRow);
      continue;
    }
    for (const study of patient.studies) {
      const stRow = getProperties(study, select, QUERY_LEVEL.STUDY);
      const pObj = JSON.parse(JSON.stringify(pRow));
      Object.assign(pObj, stRow);
      if (!study.series) {
        result.push(pObj);
        continue;
      }
      for (const series of study.series) {
        const serRow = getProperties(series, select, QUERY_LEVEL.SERIES);
        const stObj = JSON.parse(JSON.stringify(pObj));
        Object.assign(stObj, serRow);
        if (!series.images) {
          result.push(stObj);
          continue;
        }
        for (const image of series.images) {
          const imgRow = getProperties(image, select, QUERY_LEVEL.IMAGE);
          const serObj = JSON.parse(JSON.stringify(stObj));
          Object.assign(serObj, imgRow);
          result.push(serObj);
        }
      }
    }
  }
  return result;
}
