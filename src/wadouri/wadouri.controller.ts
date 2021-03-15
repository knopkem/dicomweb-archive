import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { WadouriService } from './wadouri.service';
import { StudiesService } from 'src/studies/studies.service';

@Controller('rs/wadouri')
export class WadouriController {
  constructor(
    private readonly wadouriService: WadouriService,
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

    res.set('Content-type', 'application/dicom');
    const result = await this.wadouriService.serveFile(filePath);
    res.send(result);
  }
}
