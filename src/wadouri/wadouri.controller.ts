import { Controller, Get, Query, Res } from '@nestjs/common';
import { WadouriService } from './wadouri.service';

@Controller('rs/wadouri')
export class WadouriController {
  constructor(private readonly wadouriService: WadouriService) {}

  @Get()
  async findAll(@Query() query: any, @Res() res: any) {
    console.log(query);
    const filePath = 'C:/dev/dicomweb-nestjs/import/sample1';
    res.set('Content-type', 'application/dicom');
    const result = await this.wadouriService.serveFile(filePath);
    res.send(result);
  }
}
