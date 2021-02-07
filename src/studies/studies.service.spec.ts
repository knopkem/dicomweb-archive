import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from './studies.service';

describe('StudiesService', () => {
  let service: StudiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudiesService],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
