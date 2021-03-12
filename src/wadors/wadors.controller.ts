import { Controller, Get, Query, Res } from '@nestjs/common';
import { WadorsService } from './wadors.service';
import * as crypto from 'crypto';

@Controller('rs/wadors')
export class WadorsController {
  constructor(private readonly wadorsService: WadorsService) {}

  @Get()
  findAll(@Query() query: any, @Res() res: any) {
    console.log('wadors', query);
    const filePath = 'C:/dev/dicomweb-nestjs/import/sample1';

    const boundary = crypto.randomBytes(16).toString('hex');
    const contentId = crypto.randomBytes(16).toString('hex');

    res.set(
      'Content-Type',
      `multipart/related;start=${contentId};type='application/octed-stream';boundary='${boundary}'`,
    );

    res.send(this.wadorsService.serveFile(filePath, boundary, contentId));
  }
}
