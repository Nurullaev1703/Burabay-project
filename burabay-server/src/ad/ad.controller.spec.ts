import { Test, TestingModule } from '@nestjs/testing';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';

describe('AdController', () => {
  let controller: AdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdController],
      providers: [AdService],
    }).compile();

    controller = module.get<AdController>(AdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
