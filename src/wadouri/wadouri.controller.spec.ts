import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from '../studies/studies.service';
import { WadouriController } from './wadouri.controller';
import { WadouriService } from './wadouri.service';

jest.mock('../studies/studies.service');
const serviceMock = <jest.Mock<StudiesService>>StudiesService;

describe('WadouriController', () => {
  let controller: WadouriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WadouriController],
      providers: [
        WadouriService,
        {
          provide: StudiesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<WadouriController>(WadouriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
