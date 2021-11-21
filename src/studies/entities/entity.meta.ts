import { QUERY_LEVEL, tableNameForQueryLevel } from '../dicom/quer.level';

/**
 * Entity meta relation to database
 */
export class EntityMeta {
  constructor(public level: QUERY_LEVEL, public column: string, public vr: string, public tag: string = '') {}

  isPatientNameVr() {
    return this.vr === 'PN';
  }

  isDateOrTimeVr() {
    return this.vr === 'DA' || this.vr === 'TM';
  }

  isFloatTypeVr() {
    return this.vr == 'DS' || this.vr == 'FL' || this.vr == 'FD';
  }

  isIntTypeVr() {
    return this.vr == 'IS' || this.vr == 'SL' || this.vr == 'SS' || this.vr == 'UL' || this.vr == 'US';
  }

  isStringTypeVr() {
    return this.vr == 'DS' || this.vr == 'IS' || this.vr == 'CS';
  }

  isStringTypeIntVr() {
    return this.vr == 'IS';
  }

  isStringTypeFloatVr() {
    return this.vr == 'DS';
  }

  // returns the column name with table prefix
  canonicalColumnName(): string {
    return tableNameForQueryLevel(this.level) + '.' + this.column;
  }
}
