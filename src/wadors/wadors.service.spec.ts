import { Test, TestingModule } from '@nestjs/testing';
import { WadorsService } from './wadors.service';

describe('WadorsService', () => {
  let service: WadorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WadorsService],
    }).compile();

    service = module.get<WadorsService>(WadorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
