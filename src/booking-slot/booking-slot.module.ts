import { Module } from '@nestjs/common';
import { BookingSlotController } from './booking-slot.controller';
import { BookingSlotService } from './booking-slot.service';

@Module({
  controllers: [BookingSlotController],
  providers: [BookingSlotService]
})
export class BookingSlotModule {}
