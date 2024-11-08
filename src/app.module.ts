import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiesModule } from './studies/studies.module';
import { FilesModule } from './files/files.module';
import { WadouriModule } from './wadouri/wadouri.module';
import { WadorsModule } from './wadors/wadors.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { ScpModule } from './scp/scp.module';
import { readFile, readFileSync } from 'fs';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configPath = join(process.cwd(), 'ormconfig.json');
        const ormFile = readFileSync(configPath, 'utf8');
        const ormconfig = JSON.parse(ormFile);
        return {
          type: ormconfig['type'],
          host: ormconfig['host'],
          database: ormconfig['database'],
          synchronize: ['true', true].includes(ormconfig['synchronize']) ? true : false,
          entities: ormconfig['entities'] ? ormconfig['entities'] : [__dirname + '/studies/entities/*.entity{.ts,.js}'],
        };
      },
    }),
    // is you use sqlite database
    // TypeOrmModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'better-sqlite3',
    //     host: 'localhost',
    //     database: 'dicomweb',
    //     synchronize: true,
    //     entities: [__dirname + '/studies/entities/*.entity{.ts,.js}'],
    //   }),
    // }),
    StudiesModule,
    FilesModule,
    WadouriModule,
    WadorsModule,
    ScpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
