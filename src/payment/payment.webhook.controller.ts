import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import Stripe from "stripe";

@Controller("stripe")
export class StripeWebhookController {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
			apiVersion: "2025-10-29.clover",
		});
	}

	@Post('webhook')
	async handleWebhook(@Req() req: Request, @Res() res: Response) {
		const sig = req.headers['stripe-signature'] as string;
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

		let event: Stripe.Event;
		try {
			event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
		} catch (err: any) {
			console.error(' Webhook signature verification failed:', err.message);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}

		console.log('Received Stripe event:', event.type);

		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				const orderId = paymentIntent.metadata?.orderId;
				console.log(`Payment succeeded for Order: ${orderId}`);
				//  Update order status to PAID in DB here
				break;
			}

			case 'charge.succeeded': {
				const charge = event.data.object as Stripe.Charge;
				const orderId = charge.metadata?.orderId;
				console.log(`Charge succeeded for Order: ${orderId}`);
				break;
			}

			default:
				console.log(` Unhandled event type: ${event.type}`);
		}

		res.json({ received: true });
	}
}