import { Test, TestingModule } from '@nestjs/testing';
import { WadouriController } from './wadouri.controller';
import { WadouriService } from './wadouri.service';

describe('WadouriController', () => {
  let controller: WadouriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WadouriController],
      providers: [WadouriService],
    }).compile();

    controller = module.get<WadouriController>(WadouriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
