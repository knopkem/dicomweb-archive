import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from '../studies/studies.service';
import { FilesService } from './files.service';

jest.mock('../studies/studies.service');
const serviceMock = <jest.Mock<StudiesService>>StudiesService;

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: StudiesService,
          useValue: serviceMock,
        }
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); 
