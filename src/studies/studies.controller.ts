import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudiesService, DicomTag } from './studies.service';

function getStudyLevelTags(): DicomTag[] {
  const tags = new Array<DicomTag>();
  tags.push(new DicomTag('00080005'));
  tags.push(new DicomTag('00080020'));
  tags.push(new DicomTag('00080030'));
  tags.push(new DicomTag('00080050'));
  tags.push(new DicomTag('00080054'));
  tags.push(new DicomTag('00080056'));
  tags.push(new DicomTag('00080061'));
  tags.push(new DicomTag('00080090'));
  tags.push(new DicomTag('00100010'));
  tags.push(new DicomTag('00100020'));
  tags.push(new DicomTag('00100030'));
  tags.push(new DicomTag('00100040'));
  tags.push(new DicomTag('0020000D'));
  tags.push(new DicomTag('00200010'));
  tags.push(new DicomTag('00201206'));
  tags.push(new DicomTag('00201208'));
  return tags;
}

function getSeriesLevelTags(): DicomTag[] {
  const tags = new Array<DicomTag>();
  tags.push(new DicomTag('00080005'));
  tags.push(new DicomTag('00080054'));
  tags.push(new DicomTag('00080056'));
  tags.push(new DicomTag('00080060'));
  tags.push(new DicomTag('0008103E'));
  tags.push(new DicomTag('00081190'));
  tags.push(new DicomTag('0020000E'));
  tags.push(new DicomTag('00200011'));
  tags.push(new DicomTag('00201209'));
  return tags;
}

@Controller('rs/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Get()
  findAll(@Query() query: any) {
    console.log(query);
    const tags = getStudyLevelTags();
    return this.studiesService.findMeta(tags);
  }

  @Get(':studyUid')
  findOne(@Param('studyUid') studyUid: string) {
    const tags = getStudyLevelTags();
    return this.studiesService.findMeta(tags);
  }

  @Get(':studyUid/metadata')
  findOneStudyMeta(@Param('studyUid') studyUid: string) {
    return this.studiesService.findOne(studyUid);
  }

  @Get(':studyUid/series')
  findAllSeries(@Param() params: any) {
    console.log(params);
    const tags = getSeriesLevelTags();
    return this.studiesService.findMeta(tags);
  }

  @Get(':studyUid/series/:seriesUid')
  findOneSeries(
    @Param('studyUid') studyUid: string,
    @Param('seriesUid') seriesUid: string,
  ) {
    console.log(studyUid, seriesUid);
    return this.studiesService.findOne(studyUid);
  }
  @Get(':studyUid/series/:seriesUid/metadata')
  findOneSeriesMeta(
    @Param('studyUid') studyUid: string,
    @Param('seriesUid') seriesUid: string,
  ) {
    console.log(studyUid, seriesUid);
    return this.studiesService.findOne(studyUid);
  }
}
