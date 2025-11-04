// src/push/push.service.ts
import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';

@Injectable()
export class PushService {
	private subscriptions: any[] = [];
	constructor() {
		webPush.setVapidDetails(
			'mailto:you@example.com',
			process.env.VAPID_PUBLIC_KEY,
			process.env.VAPID_PRIVATE_KEY,
		);
	}

	addSubscription(subscription: any) {
		this.subscriptions.push(subscription);
		return { message: 'Subscription added!' };
	}

	async sendNotification(payload: any) {
		const sendPromises = this.subscriptions.map((sub) =>
			webPush.sendNotification(sub, JSON.stringify(payload)),
		);
		await Promise.allSettled(sendPromises);
		return { message: 'Notifications sent!' };
	}
}
