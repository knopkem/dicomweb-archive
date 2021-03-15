import { Module } from '@nestjs/common';
import { WadouriService } from './wadouri.service';
import { WadouriController } from './wadouri.controller';
import { StudiesModule } from './../studies/studies.module';

@Module({
  imports: [StudiesModule],
  controllers: [WadouriController],
  providers: [WadouriService],
})
export class WadouriModule {}
