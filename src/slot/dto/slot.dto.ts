import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsString } from 'class-validator';

export class GenerateSlotsDto {
	@ApiProperty({
		description: 'Confirmation message indicating that slots were generated for the next 7 days.',
		example: 'Slots successfully generated for the next 7 days.',
	})
	message: string;
}
export class GetAvailableSlotsDto {
	@ApiProperty({
		description: 'Date for which available slots are requested in ISO format (YYYY-MM-DD)',
		example: '2025-10-30',
	})
	@IsDateString()
	date: string;
}

export class AvailableSlotDto {
	@ApiProperty({
		description: 'Start time of the available slot.',
		example: '09:00',
	})
	startTime: string;

	@ApiProperty({
		description: 'End time of the available slot.',
		example: '10:00',
	})
	endTime: string;

	@ApiProperty({
		description: 'The status of the slot (whether it is available or booked).',
		example: 'available',
	})
	status: string;
}

export class GetAvailableSlotsResponseDto {
	@ApiProperty({
		description: 'List of available slots for the requested date.',
		type: [AvailableSlotDto],
	})
	availableSlots: AvailableSlotDto[];
}


export class BookSlotsDto {
	@ApiProperty({
		description: 'Date for the booking in ISO format (YYYY-MM-DD)',
		example: '2025-10-30',
	})
	@IsDateString()
	date: string;

	@ApiProperty({
		description: 'List of slot times to be booked for the specified date',
		example: ['09:00', '10:00'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	slotTimes: string[];
}


export class BookSlotsResponseDto {
	@ApiProperty({
		description: 'Confirmation message indicating successful booking of the slots.',
		example: 'Slots booked successfully for the date: 2025-11-05.',
	})
	message: string;

	@ApiProperty({
		description: 'Details of the booked slots.',
		example: [
			{
				startTime: '09:00',
				endTime: '10:00',
				status: 'booked',
				bookedBy: 'user123',
			},
		],
	})
	bookedSlots: {
		startTime: string;
		endTime: string;
		status: string;
		bookedBy: string;
	}[];
}