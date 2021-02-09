import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudiesModule } from './studies/studies.module';
import { FilesModule } from './files/files.module';
import { Study } from './studies/entities/study.entity';
import { Series } from './studies/entities/series.entity';
import { Image } from './studies/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dicomweb',
      entities: [Study, Series, Image],
      synchronize: true,
    }),
    StudiesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
