import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Study, Series, Image])],
  controllers: [StudiesController],
  providers: [StudiesService],
  exports: [StudiesService],
})
export class StudiesModule {}
