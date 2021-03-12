import { Controller, Get, Query, Res } from '@nestjs/common';
import { WadorsService } from './wadors.service';
import * as crypto from 'crypto';

@Controller(
  'rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frame',
)
export class WadorsController {
  constructor(private readonly wadorsService: WadorsService) {}

  @Get()
  findAll(@Query() query: any, @Res() res: any) {
    const filePath = 'C:/dev/dicomweb-nestjs/import/sample1';

    const boundary = crypto.randomBytes(16).toString('hex');
    const contentId = crypto.randomBytes(16).toString('hex');
    const contentType = `multipart/related;boundary='${boundary}'`;
    res.set('Content-Type', contentType);
    this.wadorsService.serveFile(res, filePath, boundary, contentId);
  }
}
