import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Payment') // Groups routes in Swagger UI
@ApiBearerAuth() // Indicates JWT bearer auth is used
@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post()
	@ApiOperation({ summary: 'Process a payment for the authenticated user' })
	@ApiBody({ type: PaymentDto })
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
		
	@ApiResponse({ status: 400, description: 'Invalid request or authentication error' })
	processPayment(@Req() req: any, @Body() dto: PaymentDto) {
		console.log('Processing payment for user:', req.user.id);
		console.log('Payment details:', dto);
		return this.paymentService.processPayment(req.user.id, dto);
	}
}
