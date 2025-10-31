import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SlotService } from './slot.service';
import { GenerateSlotsDto, GetAvailableSlotsDto, GetAvailableSlotsResponseDto, BookSlotsDto, BookSlotsResponseDto, GenerateSlotsAdminDto } from './dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { UserRole } from 'src/auth/schema/auth.schema';

@ApiTags('Slots') 
	@Controller('slots')
	@ApiBearerAuth()
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
	@UseGuards(AuthGuard ,RolesGuard)
	@Roles(UserRole.ADMIN)
	@Post('generate-range')
	async generateCustomSlots(@Body() dto: GenerateSlotsAdminDto) {
		return this.slotService.generateSlotsForDateRange(dto);
	}

	@UseGuards(AuthGuard)

	@Post('available')
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
	getAvailable(@Body() date: GetAvailableSlotsDto) {
		return this.slotService.getAvailableSlots(date.date);
	}

	
	@UseGuards(AuthGuard)
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
	async bookSlots(@Req() req:any, @Body() body: BookSlotsDto) {
		const userId = req.user?._id || 'guest';
		return this.slotService.bookSlots(userId, body.date, body.slotTimes);
	}
}
