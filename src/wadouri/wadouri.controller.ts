import { Controller, Get, Header, Logger, NotFoundException, Query, Res } from '@nestjs/common';
import { WadouriService } from './wadouri.service';
import { StudiesService } from '../studies/studies.service';
import { Response } from 'express';
import { WadoUriDto } from './dto/wadouri.dto';

@Controller('wadouri')
export class WadouriController {
  constructor(private readonly wadouriService: WadouriService, private readonly studiesService: StudiesService) {}

  logger = new Logger('WadouriController');

  @Header('Content-type', 'application/dicom')
  @Get()
  async findAll(@Res() res: Response, @Query() wado: WadoUriDto) {
    // get the path to the file based on uids, we use the study service for this
    const filePath = await this.studiesService.getFilepath(wado.studyUID, wado.seriesUID, wado.objectUID);

    if (!filePath) {
      this.logger.error('File not found');
      throw new NotFoundException();
    }

    const buffer = await this.wadouriService.getFileBufferFromFile(filePath);
    const stream = this.wadouriService.getReadableStream(buffer);
    stream.pipe(res);
  }
}
