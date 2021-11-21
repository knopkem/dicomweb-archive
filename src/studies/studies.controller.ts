import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudiesService, DicomTag } from './studies.service';
import { DicomDict } from './dicom/dicom.dict';

function getStudyLevelTags(): Set<DicomTag> {
  const tags = new Set<DicomTag>();
  tags.add(new DicomTag('00080005')); // specific character set
  tags.add(new DicomTag('00080020')); // study date
  tags.add(new DicomTag('00080030')); // study time
  tags.add(new DicomTag('00080050')); // accession number
  tags.add(new DicomTag('00080054')); // retrieve AE Tile
  tags.add(new DicomTag('00080056')); // instance availability
  tags.add(new DicomTag('00080061')); // ModalitiesInStudy
  tags.add(new DicomTag('00080090')); // referring physicians name
  tags.add(new DicomTag('00081030')); // study description
  tags.add(new DicomTag('00100010')); // patient name
  tags.add(new DicomTag('00100020')); // patient id
  tags.add(new DicomTag('00100030')); // patient dob
  tags.add(new DicomTag('00100040')); // patient sex
  tags.add(new DicomTag('0020000D')); // study instance UID
  tags.add(new DicomTag('00200010')); // study ID
  tags.add(new DicomTag('00201206')); // NumberOfStudyRelatedSeries
  tags.add(new DicomTag('00201208')); // NumberOfStudyRelatedInstances
  tags.add(new DicomTag('00080060')); // Modality (this is actually a series level tag, use if modalities in study is not supported)
  return tags;
}

function getSeriesLevelTags(): Set<DicomTag> {
  const tags = new Set<DicomTag>();
  tags.add(new DicomTag('00080005')); // specific character set
  tags.add(new DicomTag('00080054')); // retrieve AE Title
  tags.add(new DicomTag('00080056')); // instance availablility notification
  tags.add(new DicomTag('00080060')); // modality
  tags.add(new DicomTag('0008103E')); // series description
  tags.add(new DicomTag('00081190')); // retrieve url attribute
  tags.add(new DicomTag('0020000E')); // series instance UID
  tags.add(new DicomTag('00200011')); // series number
  tags.add(new DicomTag('00201209')); // additional query/retrieve attributes
  return tags;
}

function getImageLevelTags(): Set<DicomTag> {
  const tags = new Set<DicomTag>();
  tags.add(new DicomTag('00080016')); // SOP Class UID
  tags.add(new DicomTag('00080018')); // SOP Instance UID
  tags.add(new DicomTag('00080060')); // Modality --> series

  // everything below needed for WadoRS only
  tags.add(new DicomTag('00280002')); // Samples per Pixel
  tags.add(new DicomTag('00280004')); // Photometric Interpretation
  tags.add(new DicomTag('00280010')); // Rows
  tags.add(new DicomTag('00280011')); // Columns
  tags.add(new DicomTag('00280030')); // Pixel Spacing
  tags.add(new DicomTag('00280100')); // Bits Allocated
  tags.add(new DicomTag('00280101')); // Bits Stored
  tags.add(new DicomTag('00280102')); // High Bit
  tags.add(new DicomTag('00280103')); // Pixel Representation
  tags.add(new DicomTag('00281050')); // Window Center
  tags.add(new DicomTag('00281051')); // Window Width
  tags.add(new DicomTag('00281052')); // Rescale Intercept
  tags.add(new DicomTag('00281053')); // Rescale Slope
  tags.add(new DicomTag('00200032')); // Image Position Patient
  tags.add(new DicomTag('00200037')); // Image Orientation Patient
  return tags;
}

@Controller(['rs/studies', 'viewer/rs/studies'])
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  /**
   * Helper to parse includes
   * @param includefield 
   * @returns 
   */
  private parseIncludes(includefield: string | undefined): DicomTag[] {
    const tags = new Array<DicomTag>();
    if (includefield) {
      tags.push(...includefield.split(',').map((elem: string) => new DicomTag(elem)));
    }
    return tags;
  }

  /**
   * Helper to parse and transform query data
   * @param query 
   * @returns 
   */
  private parseQuery(query: any): DicomTag[] {
    const tags = new Array<DicomTag>();
    Object.keys(query).forEach((propName) => {
      const tag = DicomDict.findFromDicomName(propName);
      if (tag) {
        const value = query[propName];
        tags.push({ key: tag, value });
      }
    });
    return tags;
  }

  @Get()
  findAll(@Query() query: any) {
    const tags = getStudyLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid')
  findOne(@Query() query: any, @Param('studyInstanceUid') studyUid: string) {
    const tags = getStudyLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/metadata')
  findOneStudyMeta(@Query() query: any, @Param('studyInstanceUid') studyUid: string) {
    const st = getStudyLevelTags();
    const se = getSeriesLevelTags();
    const tags = new Set<DicomTag>([...st, ...se]);
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series')
  findAllSeries(@Query() query: any, @Param('studyInstanceUid') studyUid: string) {
    const tags = getSeriesLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid')
  findOneSeries(@Query() query: any, @Param('studyInstanceUid') studyUid: string, @Param('seriesInstanceUid') seriesUid: string) {
    const tags = getSeriesLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    tags.add(new DicomTag('0020000E', seriesUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/instances')
  findOneSeriesInstances(@Query() query: any, @Param('studyInstanceUid') studyUid: string, @Param('seriesInstanceUid') seriesUid: string) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    tags.add(new DicomTag('0020000E', seriesUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/metadata')
  findOneSeriesMeta(@Query() query: any, @Param('studyInstanceUid') studyUid: string, @Param('seriesInstanceUid') seriesUid: string) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    tags.add(new DicomTag('0020000E', seriesUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid')
  findOneSeriesInstance(
    @Query() query: any,
    @Param('studyInstanceUid') studyUid: string,
    @Param('seriesInstanceUid') seriesUid: string,
    @Param('sopInstanceUid') imageUid: string,
  ) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', studyUid));
    tags.add(new DicomTag('0020000E', seriesUid));
    tags.add(new DicomTag('00080018', imageUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }
}
