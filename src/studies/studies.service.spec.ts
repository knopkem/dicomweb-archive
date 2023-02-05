import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from './studies.service';
import { Connection, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Study } from './entities/study.entity';
import { Series } from './entities/series.entity';
import { Image } from './entities/image.entity';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';

const mockConnection = (<unknown>{
  transaction: jest.fn(),
}) as Connection;

describe('StudiesService', () => {
  let service: StudiesService;
  let patientRepository: Repository<Patient>;
  let studyRepository: Repository<Study>;
  let seriesRepository: Repository<Series>;
  let imageRepository: Repository<Image>;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudiesService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
        {
          provide: getRepositoryToken(Patient), 
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Study), 
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Series), 
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Image), 
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          }
        } 
      ],
    }).compile();
    connection = module.get<Connection>(getConnectionToken());
    service = module.get<StudiesService>(StudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
