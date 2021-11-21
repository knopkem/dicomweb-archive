
// a private tag to store and query or filename
export const PRIVATE_FILENAME = '00110011';

/**
 * Defines the common DICOM levels
 */
export enum QUERY_LEVEL {
  PATIENT,
  STUDY,
  SERIES,
  IMAGE,
}

/**
 * get the table name for a given query level
 * @param level query level enum
 * @returns table name
 */
export function tableNameForQueryLevel(level: QUERY_LEVEL): string {
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
