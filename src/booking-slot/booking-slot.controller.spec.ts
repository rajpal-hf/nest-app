import { Test, TestingModule } from '@nestjs/testing';
import { BookingSlotController } from './booking-slot.controller';

describe('BookingSlotController', () => {
  let controller: BookingSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingSlotController],
    }).compile();

    controller = module.get<BookingSlotController>(BookingSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
