import { Test, TestingModule } from '@nestjs/testing';
import { BookingBanDateService } from './booking-ban-date.service';

describe('BookingBanDateService', () => {
  let service: BookingBanDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingBanDateService],
    }).compile();

    service = module.get<BookingBanDateService>(BookingBanDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
