// payment.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('payment')
export class RazorpayController {
	constructor(private paymentService: RazorpayService) { }

	@Post('create-order')
	async createOrder(@Body('amount') amount: number) {
		const order = await this.paymentService.createOrder(amount);
		return { orderId: order.id, amount: order.amount, currency: order.currency };
	}

	@Post('verify')
	async verifyPayment(@Body() body: any) {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
		const isValid = this.paymentService.verifyPayment(
			razorpay_signature,
			razorpay_order_id,
			razorpay_payment_id,
		);
		return { success: isValid };
	}
}
