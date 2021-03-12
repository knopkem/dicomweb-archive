import { Test, TestingModule } from '@nestjs/testing';
import { WadouriService } from './wadouri.service';

describe('WadouriService', () => {
  let service: WadouriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WadouriService],
    }).compile();

    service = module.get<WadouriService>(WadouriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
