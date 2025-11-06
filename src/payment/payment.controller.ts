import  { Body, Controller, HttpException, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('stripe')
@Controller('stripe')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) { }
	@Post('checkout')
	async checkout(
		@Body() body: { orderId: string; email?: string },
		@Req() req: any
	) {
		try {
				const userId = '6902fc9a77be204f6d6a90d1';
				const { orderId, email } = body;
			
			console.log( "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",userId , orderId, email)

		return this.paymentService.createPaymentIntent(userId, orderId, {
			receipt_email: email,
		});
		} catch (error) {
			console.log()
			throw error instanceof HttpException ? error : new HttpException( " checkout controller erro", 500)
			
		}
	}
}



































