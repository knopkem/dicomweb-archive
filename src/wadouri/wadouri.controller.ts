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

@Controller('wadouri')
export class WadouriController {
  constructor(
    private readonly wadouriService: WadouriService,
    private readonly studiesService: StudiesService,
  ) {}

  @Get()
  async findAll(
    @Res() res: any,
    @Query('studyUID') studyUid: string,
    @Query('seriesUID') seriesUid: string,
    @Query('objectUID') imageUid: string,
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
