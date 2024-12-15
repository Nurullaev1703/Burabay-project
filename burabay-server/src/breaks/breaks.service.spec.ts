import { Test, TestingModule } from '@nestjs/testing';
import { BreaksService } from './breaks.service';

describe('BreaksService', () => {
  let service: BreaksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreaksService],
    }).compile();

    service = module.get<BreaksService>(BreaksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
