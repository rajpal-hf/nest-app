// payment.service.ts
import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
	private razorpay: Razorpay;

	constructor() {
		this.razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});
	}

	async createOrder(amount: number, currency = 'INR') {
		const options = {
			amount: amount * 100, 
			currency,
			receipt: 'receipt_' + new Date().getTime(),
		};
		const order = await this.razorpay.orders.create(options);
		return order;
	}

	verifyPayment(signature: string, orderId: string, paymentId: string) {
		const body = orderId + '|' + paymentId;
		const expectedSignature = crypto
			.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
			.update(body.toString())
			.digest('hex');
		return expectedSignature === signature;
	}
}
