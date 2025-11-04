// src/push/push.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
	constructor(private readonly pushService: PushService) { }

	@Post('subscribe')
	subscribe(@Body() subscription: any) {
		return this.pushService.addSubscription(subscription);
	}

	@Post('notify')
	async notify(@Body() payload: any) {
		return this.pushService.sendNotification(payload);
	}
}
