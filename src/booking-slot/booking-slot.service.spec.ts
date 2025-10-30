import { Test, TestingModule } from '@nestjs/testing';
import { BookingSlotService } from './booking-slot.service';

describe('BookingSlotService', () => {
  let service: BookingSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingSlotService],
    }).compile();

    service = module.get<BookingSlotService>(BookingSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
