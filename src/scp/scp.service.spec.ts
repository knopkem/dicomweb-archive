import { Test, TestingModule } from '@nestjs/testing';
import { ScpService } from './scp.service';

describe('ScpService', () => {
  let service: ScpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScpService],
    }).compile();

    service = module.get<ScpService>(ScpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
