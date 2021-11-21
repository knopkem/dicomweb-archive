import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudiesService, DicomTag } from './studies.service';
import { DicomDict } from './dicom/dicom.dict';
import { StudyDto } from './dto/study.dto';
import { SeriesDto } from './dto/series.dto';
import { ImageDto } from './dto/image.dto';
import { getStudyLevelTags, getSeriesLevelTags, getImageLevelTags } from './dicom/dicom.tags';


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
      const tag = DicomDict.canonicalNameToHex(propName);
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
  findOne(@Query() query: any, @Param() dto: StudyDto) {
    const tags = getStudyLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/metadata')
  findOneStudyMeta(@Query() query: any, @Param() dto: StudyDto) {
    const st = getStudyLevelTags();
    const se = getSeriesLevelTags();
    const tags = new Set<DicomTag>([...st, ...se]);
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series')
  findAllSeries(@Query() query: any, @Param() dto: StudyDto) {
    const tags = getSeriesLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid')
  findOneSeries(@Query() query: any, @Param() dto: SeriesDto) {
    const tags = getSeriesLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    tags.add(new DicomTag('0020000E', dto.seriesInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/instances')
  findOneSeriesInstances(@Query() query: any, @Param() dto: SeriesDto) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    tags.add(new DicomTag('0020000E', dto.seriesInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/metadata')
  findOneSeriesMeta(@Query() query: any, @Param() dto: SeriesDto) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    tags.add(new DicomTag('0020000E', dto.seriesInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }

  @Get(':studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid')
  findOneSeriesInstance(@Query() query: any, @Param() dto: ImageDto) {
    const tags = getImageLevelTags();
    const queryTags = this.parseQuery(query);
    queryTags.reduce((s, e) => s.add(e), tags);
    this.parseIncludes(query.includefield).reduce((s, e) => s.add(e), tags);
    tags.add(new DicomTag('0020000D', dto.studyInstanceUid));
    tags.add(new DicomTag('0020000E', dto.seriesInstanceUid));
    tags.add(new DicomTag('00080018', dto.sopInstanceUid));
    return this.studiesService.findMeta([...tags], query.offset, query.limit);
  }
}
