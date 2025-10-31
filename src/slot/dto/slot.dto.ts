import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsDateString,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateSlotsDto {
	@ApiProperty({
		description:
			'Confirmation message indicating that slots were generated for the next 7 days.',
		example: 'Slots successfully generated for the next 7 days.',
	})
	message: string;
}

export class GenerateSlotsAdminDto {
	@ApiProperty({
		description: 'Start date from which to generate slots (inclusive)',
		example: '2025-11-01T00:00:00.000Z',
	})
	@IsDateString()
	startDate: string;

	@ApiProperty({
		description: 'End date until which to generate slots (inclusive)',
		example: '2025-11-07T00:00:00.000Z',
	})
	@IsDateString()
	endDate: string;

	@ApiProperty({
		description: 'Opening hour in 24-hour format (default: 10:00)',
		example: '10:00',
		required: false,
	})
	@IsOptional()
	@IsString()
	openingTime?: string;

	@ApiProperty({
		description: 'Closing hour in 24-hour format (default: 22:00)',
		example: '22:00',
		required: false,
	})
	@IsOptional()
	@IsString()
	closingTime?: string;
}
export class GetAvailableSlotsDto {
	@ApiProperty({
		description:
			'Date for which available slots are requested in ISO format (YYYY-MM-DD)',
		example: '2025-10-30',
	})
	@IsDateString()
	date: string;
}

export class AvailableSlotDto {
	@ApiProperty({
		description: 'Start time of the available slot (ISO 8601 DateTime).',
		example: '2025-10-30T09:00:00.000Z',
	})
	@IsDateString()
	startTime: Date;

	@ApiProperty({
		description: 'End time of the available slot (ISO 8601 DateTime).',
		example: '2025-10-30T09:30:00.000Z',
	})
	@IsDateString()
	endTime: Date;

	@ApiProperty({
		description: 'The status of the slot (whether it is available or booked).',
		example: 'available',
	})
	@IsString()
	status: string;

	@ApiProperty({
		description: 'User ID who booked the slot (null if available).',
		example: '64fa92b1e13d1b42a38ad234',
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsString()
	bookedBy?: string | null;
}

export class GetAvailableSlotsResponseDto {
	@ApiProperty({
		description: 'List of available slots for the requested date.',
		type: [AvailableSlotDto],
	})
	@ValidateNested({ each: true })
	@Type(() => AvailableSlotDto)
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
		description:
			'List of start times (in ISO 8601 format) of the slots to be booked.',
		example: ['2025-10-30T09:00:00.000Z', '2025-10-30T09:30:00.000Z'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	slotTimes: string[];
}

export class BookSlotsResponseDto {
	@ApiProperty({
		description:
			'Confirmation message indicating successful booking of the slots.',
		example: 'Slots booked successfully for the date: 2025-11-05.',
	})
	message: string;

	@ApiProperty({
		description: 'Details of the booked slots.',
		example: [
			{
				startTime: '2025-10-30T09:00:00.000Z',
				endTime: '2025-10-30T09:30:00.000Z',
				status: 'booked',
				bookedBy: '64fa92b1e13d1b42a38ad234',
			},
		],
	})
	bookedSlots: {
		startTime: Date;
		endTime: Date;
		status: string;
		bookedBy: string;
	}[];
}
