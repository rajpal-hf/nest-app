import  common from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import Stripe from 'stripe';

@ApiTags('Payment')
@common.Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) { }

	// OLD Manual Payment
	@common.Post()
	@ApiOperation({ summary: 'Manually process payment (for offline/manual)' })
	@common.UseGuards(AuthGuard)
	@ApiBearerAuth()
	processPayment(@common.Req() req: any, @common.Body() dto: PaymentDto) {
		return this.paymentService.processPayment(req.user.id, dto);
	}

	//new  payment controller 

	@common.Post('create-checkout-session')	
	@common.UseGuards(AuthGuard)
	@ApiBearerAuth()
	async createCheckoutSession(
		@common.Req() req: any,
		@common.Body() body: { orderId: string; amount: number; currency: string },
	): Promise<Stripe.Checkout.Session> {
		const { orderId, amount, currency } = body;
		return this.paymentService.createCheckoutSession(req.user.id, orderId, amount, currency);
	}

	
	@common.Post('webhook')
	async stripeWebhook(
		@common.Headers('stripe-signature') signature: string,
		@common.Req() request: common.RawBodyRequest<Request>,
	) {
		const stripe = new Stripe(process.env.STRIPE_SECRET!);
		const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(
				(request as any).rawBody,
				signature,
				endpointSecret,
			);
		} catch (err: any) {
			console.error(' Webhook signature verification failed.', err.message);
			throw new Error(`Webhook Error: ${err.message}`);
		}

		await this.paymentService.handleStripeWebhook(event);
		return { received: true };
	}
}












































// import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { PaymentService } from './payment.service';
// import { PaymentDto } from './dto/payment.dto';
// import { AuthGuard } from 'src/auth/guard/auth.guard';
// import Stripe from 'stripe';

// @ApiTags('Payment') // Groups routes in Swagger UI
// @ApiBearerAuth() // Indicates JWT bearer auth is used
// @Controller('payment')
// export class PaymentController {
// 	constructor(private readonly paymentService: PaymentService) {}


// 	//old handler
// 	@Post()
// 	@ApiOperation({ summary: 'Process a payment for the authenticated user' })
// 	@ApiBody({ type: PaymentDto })
// 	@UseGuards(AuthGuard)
// 	@ApiBearerAuth()
		
// 	@ApiResponse({ status: 400, description: 'Invalid request or authentication error' })
// 	processPayment(@Req() req: any, @Body() dto: PaymentDto) {
// 		console.log('Processing payment for user:', req.user.id);
// 		console.log('Payment details:', dto);
// 		return this.paymentService.processPayment(req.user.id, dto);
// 	}

// 	// new handler 
// 	@ApiBody({
// 		schema: {
// 			type: 'object',
// 			properties: {
// 				amount: { type: 'number', example: 5000, description: 'Amount in smallest currency unit (e.g., cents)' },
// 				currency: { type: 'string', example: 'usd', description: 'Currency code (ISO 4217)' },
// 				productId: { type: 'string', example: 'prod_12345', description: 'Stripe Product ID' },
// 				quantity: { type: 'number', example: 2, description: 'Number of items to purchase' },
// 			},
// 			required: ['amount', 'currency', 'productId', 'quantity'],
// 		},
// 	})
// 	@Post('create-checkout-session') 
// 	async createCheckoutSession(
// 		@Body() body: { amount: number; currency: string; productId: string; quantity: number }
// 	): Promise<Stripe.Checkout.Session> {
// 		const { amount, currency, productId, quantity } = body; 

// 		return this.paymentService.createCheckoutSession(amount, currency, productId, quantity); 
// 	}
// }
