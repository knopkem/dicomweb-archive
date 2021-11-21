import * as dict from 'dicom-data-dictionary';

/**
 * Helper class to lookup dicom tags or via hex or canonical name
 */
export class DicomDict {
  static dictionary = new dict.DataElementDictionary();

  static hexToCanonicalName(tagId: string): string {
    return this.dictionary.lookup(tagId)?.name;
  }

  static canonicalNameToHex(tagName: string): string {
    for (const key of Object.keys(dict.standardDataElements)) {
      const value = dict.standardDataElements[key];
      if (value.name === tagName) {
        return key;
      }
    }
    return tagName;
  }
}

