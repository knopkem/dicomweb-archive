import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudiesService } from './studies.service';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Get()
  findAll(@Query() query) {
    console.log(query);
    return this.studiesService.findAll();
  }

  @Get(':studyUid')
  findOne(@Param('studyUid') studyUid: string) {
    return this.studiesService.findOne(studyUid);
  }

  @Get(':studyUid/metadata')
  findOneStudyMeta(@Param('studyUid') studyUid: string) {
    return this.studiesService.findOne(studyUid);
  }

  @Get(':studyUid/series')
  findAllSeries(@Param() params) {
    console.log(params);
    return this.studiesService.findAll();
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
