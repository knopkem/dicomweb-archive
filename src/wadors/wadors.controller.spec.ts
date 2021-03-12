import { Test, TestingModule } from '@nestjs/testing';
import { WadorsController } from './wadors.controller';
import { WadorsService } from './wadors.service';

describe('WadorsController', () => {
  let controller: WadorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WadorsController],
      providers: [WadorsService],
    }).compile();

    controller = module.get<WadorsController>(WadorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
