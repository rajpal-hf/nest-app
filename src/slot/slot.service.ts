import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from './schema/slot.schema';
import dayjs from 'dayjs';

@Injectable()
export class SlotService {
	private readonly logger = new Logger(SlotService.name);

	constructor(@InjectModel(Slot.name) private slotModel: Model<SlotDocument>) { }

	async generateSlotsForNext7Days() {
		const today = dayjs().startOf('day');

	
		await this.slotModel.deleteMany({ date: { $lt: today.format('YYYY-MM-DD') } });

		for (let i = 0; i < 7; i++) {
			const date = today.add(i, 'day').format('YYYY-MM-DD');
			await this.generateSlotsForDate(date);
		}

		this.logger.log('✅ Slots updated for next 7 days');
	}



	private async generateSlotsForDate(date: string) {
		const existingSlots = await this.slotModel.find({ date });
		if (existingSlots.length > 0) return;

		const slots: Partial<Slot>[] = []; 	
		let start = dayjs(`${date} 10:00`, 'YYYY-MM-DD HH:mm');
		const close = dayjs(`${date} 22:00`, 'YYYY-MM-DD HH:mm');

		while (start.isBefore(close)) {
			const end = start.add(30, 'minute');
			slots.push({
				date,
				startTime: start.format('HH:mm'),
				endTime: end.format('HH:mm'),
				status: 'available',
			});
			start = end;
		}

		await this.slotModel.insertMany(slots);
	}


	async getAvailableSlots(date: string) {
		console.log('Fetching available slots for date:', date);
		const res = await this.slotModel.find({ date, status: 'available' });
		console.log('Available slots:', res);
		return res
	}

	async bookSlots(userId: string, date: string, slotTimes: string[]) {
		const slots = await this.slotModel.find({
			date,
			startTime: { $in: slotTimes },
			status: 'available',
		});

		if (slots.length !== slotTimes.length) {
			throw new Error('Some slots already booked');
		}

		await this.slotModel.updateMany(
			{ date, startTime: { $in: slotTimes } },
			{ $set: { status: 'booked', bookedBy: userId } },
		);

		return { message: 'Slots booked successfully', date, slots: slotTimes };
	}
}
