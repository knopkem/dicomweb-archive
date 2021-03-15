import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiesModule } from './studies/studies.module';
import { FilesModule } from './files/files.module';
import { Study } from './studies/entities/study.entity';
import { Series } from './studies/entities/series.entity';
import { Image } from './studies/entities/image.entity';
import { Patient } from './studies/entities/patient.entity';
import { WadouriModule } from './wadouri/wadouri.module';
import { WadorsModule } from './wadors/wadors.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dicomweb',
      entities: [Patient, Study, Series, Image],
      synchronize: true,
      logging: [],
    }),
    StudiesModule,
    FilesModule,
    WadouriModule,
    WadorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
