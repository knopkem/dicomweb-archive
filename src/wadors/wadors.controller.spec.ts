import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from '../studies/studies.service';
import { WadorsController } from './wadors.controller';
import { WadorsService } from './wadors.service';

jest.mock('../studies/studies.service');
const serviceMock = <jest.Mock<StudiesService>>StudiesService;

describe('WadorsController', () => {
  let controller: WadorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WadorsController],
      providers: [
        WadorsService,
        {
          provide: StudiesService,
          useValue: serviceMock,
        }
      ],
    }).compile();

    controller = module.get<WadorsController>(WadorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
