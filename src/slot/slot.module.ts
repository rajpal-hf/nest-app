import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotSchema } from './schema/slot.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Slot', schema: SlotSchema }]
			
		),AuthModule
	],
  controllers: [SlotController],
  providers: [SlotService]
})
export class SlotModule {}
