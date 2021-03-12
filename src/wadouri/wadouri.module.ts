import { Module } from '@nestjs/common';
import { WadouriService } from './wadouri.service';
import { WadouriController } from './wadouri.controller';

@Module({
  controllers: [WadouriController],
  providers: [WadouriService]
})
export class WadouriModule {}
