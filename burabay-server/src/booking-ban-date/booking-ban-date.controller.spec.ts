import { Test, TestingModule } from '@nestjs/testing';
import { BookingBanDateController } from './booking-ban-date.controller';
import { BookingBanDateService } from './booking-ban-date.service';

describe('BookingBanDateController', () => {
  let controller: BookingBanDateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingBanDateController],
      providers: [BookingBanDateService],
    }).compile();

    controller = module.get<BookingBanDateController>(BookingBanDateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
