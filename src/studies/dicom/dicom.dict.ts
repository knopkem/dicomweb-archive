import * as dict from 'dicom-data-dictionary';

export class DicomDict {
  static dictionary = new dict.DataElementDictionary();

  static findDicomName(tagId: string): string {
    return this.dictionary.lookup(tagId)?.name;
  }

  static findFromDicomName(tagName: string): string {
    for (const key of Object.keys(dict.standardDataElements)) {
      const value = dict.standardDataElements[key];
      if (value.name === tagName) {
        return key;
      }
    }
    return tagName;
  }
}

