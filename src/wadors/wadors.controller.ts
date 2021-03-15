import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { WadorsService } from './wadors.service';
import { StudiesService } from 'src/studies/studies.service';
import * as crypto from 'crypto';

@Controller(
  'rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frame',
)
export class WadorsController {
  constructor(
    private readonly wadorsService: WadorsService,
    private readonly studiesService: StudiesService,
  ) {}

  @Get()
  async findAll(
    @Query() query: any,
    @Res() res: any,
    @Param('studyInstanceUid') studyUid: string,
    @Param('seriesInstanceUid') seriesUid: string,
    @Param('sopInstanceUid') imageUid: string,
  ) {
    const filePath = await this.studiesService.getFilepath(
      studyUid,
      seriesUid,
      imageUid,
    );

    if (!filePath) {
      throw new NotFoundException();
    }
    const boundary = crypto.randomBytes(16).toString('hex');
    const contentId = crypto.randomBytes(16).toString('hex');
    const contentType = `multipart/related;boundary='${boundary}'`;
    res.set('Content-Type', contentType);
    this.wadorsService.serveFile(res, filePath, boundary, contentId);
  }
}
