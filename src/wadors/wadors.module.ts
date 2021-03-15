import { Module } from '@nestjs/common';
import { WadorsService } from './wadors.service';
import { WadorsController } from './wadors.controller';
import { StudiesModule } from './../studies/studies.module';

@Module({
  imports: [StudiesModule],
  controllers: [WadorsController],
  providers: [WadorsService],
})
export class WadorsModule {}
