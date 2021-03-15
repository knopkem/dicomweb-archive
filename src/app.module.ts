import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiesModule } from './studies/studies.module';
import { FilesModule } from './files/files.module';
import { WadouriModule } from './wadouri/wadouri.module';
import { WadorsModule } from './wadors/wadors.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
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
