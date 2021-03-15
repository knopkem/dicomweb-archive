import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { FilesService } from './files.service';
import { StudiesModule } from './../studies/studies.module';

@Module({
  imports: [StudiesModule],
  providers: [FilesService],
})
export class FilesModule implements OnModuleInit {
  constructor(private fileService: FilesService) {}
  logger = new Logger('FilesModule');

  onModuleInit() {
    this.logger.verbose(`Initialization...`);
    this.fileService.import();
  }
}
