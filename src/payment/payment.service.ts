import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Stripe } from 'stripe';
import { Order, OrderDocument, PaymentStatus } from 'src/order/schema/order.schema';
import { Payment, PaymentDocument } from './schema/payment.schema';

@Injectable()
export class PaymentService {
	private stripe: Stripe;

	constructor(
		private configService: ConfigService,
		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
	) {
		this.stripe = new Stripe(process.env.STRIPE_SECRET!);
	}

	/**
	 * Create Stripe Checkout Session
	 */
	async createCheckoutSession(
		userId: string,
		orderId: string,
		amount: number,
		currency: string,
	) {
		try {
			const order = await this.orderModel.findById(orderId);
			if (!order) throw new HttpException('Order not found', 404);

			const session = await this.stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: [
					{
						price_data: {
							currency,
							product_data: { name: `Order #${orderId}` },
							unit_amount: amount * 100,
						},
						quantity: 1,
					},
				],
				mode: 'payment',
				success_url: `${this.configService.get('FRONTEND_URL')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-cancel`,
				metadata: {
					userId,
					orderId,
				},
			});

			return session;
		} catch (error) {
			console.error('Stripe Session Error:', error);
			throw new InternalServerErrorException('Failed to create checkout session');
		}
	}

	/**
	 * Webhook handler to confirm payment success/failure
	 */
	async handleStripeWebhook(event: Stripe.Event) {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;

				const userId = session.metadata?.userId;
				const orderId = session.metadata?.orderId;
				const amount = (session.amount_total ?? 0) / 100;

				// Save Payment to DB
				const payment = new this.paymentModel({
					userId,
					orderId,
					amount,
					paymentMethod: 'stripe',
					transactionId: session.payment_intent,
					status: PaymentStatus.PAID,
					date: new Date(),
				});
				await payment.save();

				// Update Order Payment Status
				await this.orderModel.findByIdAndUpdate(orderId, {
					paymentStatus: PaymentStatus.PAID,
				});

				console.log('✅ Payment success recorded for order:', orderId);
				break;
			}

			case 'checkout.session.async_payment_failed':
			case 'checkout.session.expired': {
				console.warn('❌ Payment failed or expired:', event.id);
				break;
			}

			default:
				console.log(`Unhandled event type ${event.type}`);
		}
	}

	/**
	 * Old direct/manual payment method (for offline or test)
	 */
	async processPayment(userId: string, dto: any) {
		try {
			const { orderId, paymentMethod, amount } = dto;

			const order = await this.orderModel.findById(orderId);
			if (!order) throw new HttpException('Order not found', 404);

			if (amount !== order.totalAmount)
				throw new HttpException('Invalid payment amount', 400);

			const payment = new this.paymentModel({
				userId,
				orderId,
				amount,
				paymentMethod,
				transactionId: 'txn_' + Date.now(),
				status: PaymentStatus.PAID,
				date: new Date(),
			});

			await payment.save();

			order.paymentStatus = PaymentStatus.PAID;
			await order.save();

			return { message: 'Payment processed successfully', payment };
		} catch (error) {
			console.error('Payment error:', error);
			throw error instanceof HttpException
				? error
				: new HttpException('Internal server error', 500);
		}
	}
}































// // import { HttpException, Injectable } from '@nestjs/common';
// // import { InjectModel } from '@nestjs/mongoose';
// // import { Model } from 'mongoose';
// // import { Order, OrderDocument, PaymentStatus } from 'src/order/schema/order.schema';
// // import { Payment, PaymentDocument } from './schema/payment.schema';

// // @Injectable()
// // export class PaymentService {
// // 	constructor(
// // 		@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
// // 		@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
// // 	) { }

// // 	async processPayment(userId: string, dto: any) {
		
// // 		try {
// // 			const { orderId, paymentMethod, amount } = dto;

// // 		console.log("Processing payment for user:", userId, "with DTO:", dto);

		 
			
// // 			const order = await this.orderModel.findById(orderId);
// // 			if (!order) {
// // 				throw new HttpException('Order not found', 404);
// // 			}

// // 			if (amount !== order.totalAmount) {``
// // 				throw new HttpException('Invalid payment amount', 400);
// // 			}

			

// // 			const paymentResult = {
// // 				success: true,
// // 				transactionId: 'txn_' + Date.now(),
// // 			};

// // 			if (!paymentResult.success) {
// // 				throw new HttpException('Payment failed', 400);
// // 			}

// // 			console.log("Payment successful, recording payment in database");

// // 			const payment = new this.paymentModel({
// // 				userId,
// // 				orderId,
// // 				amount,
// // 				paymentMethod,
// // 				transactionId: paymentResult.transactionId,
// // 				status: PaymentStatus.PAID,
// // 				date: new Date(),
// // 			});

// // 			await payment.save();


// // 			order.paymentStatus = PaymentStatus.PAID;
// // 			await order.save();

// // 			return {
// // 				message: 'Payment processed successfully',
// // 				payment,
// // 			};
// // 		} catch (error) {
// // 			console.error('Payment processing error:', error);
// // 			throw error instanceof HttpException
// // 				? error
// // 				: new HttpException('Internal server error', 500);
// // 		}
// // 	}
// // }
// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { Stripe } from 'stripe';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class PaymentService {
// 	private stripe: Stripe;

// 	constructor(private configService: ConfigService) {
// 		this.stripe = new Stripe(process.env.STRIPE_SECRET !);
// 	}

// 	async createCheckoutSession(
// 		amount: number,
// 		currency: string,
// 		productId: string, // Product ID can be used for better data management
// 		quantity: number
// 	): Promise<Stripe.Checkout.Session> {
// 		try {
// 			const session = await this.stripe.checkout.sessions.create({
// 				line_items: [
// 					{
// 						price_data: {
// 							currency: currency,
// 							product_data: {
// 								name: `Test Product`, // You can customize the product name as needed
// 								// Additional product information can be added here
// 							},
// 							unit_amount: amount * 100, // Amount is in cents
// 						},
// 						quantity: quantity, // Specify the quantity of the product
// 					},
// 				],
// 				mode: 'payment', // Set the mode to 'payment'
// 				success_url: `http://localhost:4242/success.html`, // Redirect URL on success
// 				cancel_url: `http://localhost:4242/cancel.html`, // Redirect URL on cancellation
// 				metadata: {
// 					// Pass any additional data here, such as user ID 
// 					// or product ID for handling in webhooks
// 					productId: productId,
// 				},
// 			});

// 			return session; // Return the created session
// 		} catch (error) {
// 			console.error('Error creating session:', error);
// 			throw new InternalServerErrorException(
// 				'Failed to create checkout session', // Handle errors gracefully
// 			);
// 		}
// 	}
// }