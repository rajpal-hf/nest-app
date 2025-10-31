import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from './schema/slot.schema';
import dayjs from 'dayjs';
import { GenerateSlotsAdminDto } from './dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SlotService {
	private readonly logger = new Logger(SlotService.name);

	constructor(@InjectModel(Slot.name) private slotModel: Model<SlotDocument>) { }

	/**
	 * Generate slots between a given start and end date.
	 * Admin can choose custom opening/closing hours.
	 */
	async generateSlotsForDateRange(dto: GenerateSlotsAdminDto) {
		const { startDate, endDate, openingTime = '10:00', closingTime = '22:00' } =
			dto;

		const start = dayjs(startDate).startOf('day');
		const end = dayjs(endDate).endOf('day');

		if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
			throw new Error('Invalid date range provided');
		}

		// Delete past available slots before the start date
		await this.slotModel.deleteMany({
			status: 'available',
			date: { $lt: start.toDate() },
		});

		const totalDays = end.diff(start, 'day') + 1;

		for (let i = 0; i < totalDays; i++) {
			const date = start.add(i, 'day');
			await this.generateSlotsForDate(date.toDate(), openingTime, closingTime);
			this.logger.log(`Generated slots for date: ${date.format('YYYY-MM-DD')}`);
		}

		return {
			message: `Slots generated successfully from ${start.format(
				'YYYY-MM-DD',
			)} to ${end.format('YYYY-MM-DD')}`,
		};
	}

	private async generateSlotsForDate(
		date: Date,
		openingTime: string,
		closingTime: string,
	) {
		const existingSlots = await this.slotModel.find({ date });
		if (existingSlots.length > 0) return;

		const slots: Partial<Slot>[] = [];

		let start = dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${openingTime}`);
		const close = dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${closingTime}`);

		while (start.isBefore(close)) {
			const end = start.add(30, 'minute');
			slots.push({
				date,
				startTime: start.toDate(),
				endTime: end.toDate(),
				status: 'available',
			});
			start = end;
		}

		await this.slotModel.insertMany(slots);
	}

	async getAvailableSlots(date: string) {
		try {
			const dayStart = dayjs(date).startOf('day').toDate();
			const dayEnd = dayjs(date).endOf('day').toDate();

			const res = await this.slotModel.find({
				date: { $gte: dayStart, $lte: dayEnd },
				status: 'available',
			});

			return res;
		} catch (error) {
			this.logger.error('Error fetching available slots:', error);
			throw error;
		}
	}

	async bookSlots(userId: string, date: string, slotTimes: string[]) {

		try {
			const dayStart = dayjs(date).startOf('day').toDate();
		const dayEnd = dayjs(date).endOf('day').toDate();

		const slotStartTimes = slotTimes.map((time) =>
			dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate(),
		);

		const slots = await this.slotModel.find({
			date: { $gte: dayStart, $lte: dayEnd },
			startTime: { $in: slotStartTimes },
			status: 'available',
		});

		if (slots.length !== slotTimes.length) {
			throw new Error('Some slots already booked');
		}

		await this.slotModel.updateMany(
			{
				date: { $gte: dayStart, $lte: dayEnd },
				startTime: { $in: slotStartTimes },
			},
			{ $set: { status: 'booked', bookedBy: new Types.ObjectId(userId) } },
		);

		return { message: 'Slots booked successfully', date, slots: slotTimes };

		} catch (error) {
			console.error('Error booking slots:', error);
			throw error instanceof Error ? error : new Error('Internal Server Error');
		}
		
	}


	
	// @Cron('*/5 * * * * *') 	
	@Cron(CronExpression.EVERY_DAY_AT_2AM) 
	async rollSlotsForNext7Days() {
		try {
			const today = dayjs().startOf('day');
			const lastDay = today.add(6, 'day').endOf('day'); //add kro curr  date me 6 days
			const nextDay = lastDay.add(1, 'day'); // or add kra 1 dya or bas ho gya


			await this.slotModel.deleteMany({
				date: { $lt: today.toDate() },
			});


			await this.generateSlotsForDate(nextDay.toDate(), '10:00', '22:00');

			this.logger.log(`Rolled slots: kept 7 days from ${today.format('YYYY-MM-DD')} and generated 8th day ${nextDay.format('YYYY-MM-DD')}`);
		} catch (err) {
			this.logger.error('Error in rolling 7-day slots cron', err);
		}
	}

	
}