import { Module } from '@nestjs/common';
import { WadorsService } from './wadors.service';
import { WadorsController } from './wadors.controller';

@Module({
  controllers: [WadorsController],
  providers: [WadorsService]
})
export class WadorsModule {}
