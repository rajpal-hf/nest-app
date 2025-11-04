import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, PaymentStatus } from 'src/order/schema/order.schema';
import { Payment, PaymentDocument } from './schema/payment.schema';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
	) { }

	async processPayment(userId: string, dto: any) {
		
		try {
			const { orderId, paymentMethod, amount } = dto;

		console.log("Processing payment for user:", userId, "with DTO:", dto);

		 
			
			const order = await this.orderModel.findById(orderId);
			if (!order) {
				throw new HttpException('Order not found', 404);
			}

			if (amount !== order.totalAmount) {``
				throw new HttpException('Invalid payment amount', 400);
			}

			

			const paymentResult = {
				success: true,
				transactionId: 'txn_' + Date.now(),
			};

			if (!paymentResult.success) {
				throw new HttpException('Payment failed', 400);
			}

			console.log("Payment successful, recording payment in database");

			const payment = new this.paymentModel({
				userId,
				orderId,
				amount,
				paymentMethod,
				transactionId: paymentResult.transactionId,
				status: PaymentStatus.PAID,
				date: new Date(),
			});

			await payment.save();


			order.paymentStatus = PaymentStatus.PAID;
			await order.save();

			return {
				message: 'Payment processed successfully',
				payment,
			};
		} catch (error) {
			console.error('Payment processing error:', error);
			throw error instanceof HttpException
				? error
				: new HttpException('Internal server error', 500);
		}
	}
}
