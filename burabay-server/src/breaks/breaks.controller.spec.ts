import { Test, TestingModule } from '@nestjs/testing';
import { BreaksController } from './breaks.controller';
import { BreaksService } from './breaks.service';

describe('BreaksController', () => {
  let controller: BreaksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreaksController],
      providers: [BreaksService],
    }).compile();

    controller = module.get<BreaksController>(BreaksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
