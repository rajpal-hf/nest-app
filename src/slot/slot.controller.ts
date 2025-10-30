import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SlotService } from './slot.service';
import { GenerateSlotsDto, GetAvailableSlotsDto, GetAvailableSlotsResponseDto, BookSlotsDto, BookSlotsResponseDto } from './dto';

@ApiTags('Slots') 
@Controller('slots')
export class SlotController {
	constructor(private readonly slotService: SlotService) { }

	@Post('generate')
	@ApiOperation({
		summary: 'Generate slots for the next 7 days',
		description: 'Generates available slots for the next 7 days for booking.',
	})
	@ApiResponse({
		status: 200,
		description: 'Slots generated successfully.',
		type: GenerateSlotsDto,
	})
	async generate() {
		return this.slotService.generateSlotsForNext7Days();
	}

	@Get('available')
	@ApiOperation({
		summary: 'Get available slots for a specific date',
		description: 'Retrieves available slots for the specified date.',
	})
	@ApiBody({ type: GetAvailableSlotsDto })
	@ApiResponse({
		status: 200,
		description: 'Available slots for the given date.',
		type: GetAvailableSlotsResponseDto,
	})
	async getAvailable(@Body() date: GetAvailableSlotsDto) {
		return this.slotService.getAvailableSlots(date.date);
	}

	@Post('book')
	@ApiOperation({
		summary: 'Book available slots for a user',
		description: 'Allows the user to book multiple slots on a specified date.',
	})
	@ApiBody({ type: BookSlotsDto })
	@ApiResponse({
		status: 200,
		description: 'Slots booked successfully.',
		type: BookSlotsResponseDto,
	})
	async bookSlots(@Req() req, @Body() body: BookSlotsDto) {
		const userId = req.user?._id || 'guest';
		return this.slotService.bookSlots(userId, body.date, body.slotTimes);
	}
}
