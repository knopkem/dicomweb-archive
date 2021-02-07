import { Module, OnModuleInit } from '@nestjs/common';
import { FilesService } from './files.service';
import { StudiesModule } from './../studies/studies.module';

@Module({
  imports: [StudiesModule],
  providers: [FilesService],
})
export class FilesModule implements OnModuleInit {
  constructor(private fileService: FilesService) {}

  onModuleInit() {
    console.log(`Initialization...`);
    this.fileService.import();
  }
}
