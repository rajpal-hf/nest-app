import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms-service.service';

@Controller('twilio')
export class SmsController {
	constructor(private readonly smsService: SmsService) { }

	@Post('send-sms')
	async sendSms(@Body('to') to: string, @Body('message') message: string) {
		const result = await this.smsService.sendSms(to, message);
		return { success: true, result };
	}

	@Post('send-otp')
	async sendOtp(@Body('to') to: string) {
		const result = await this.smsService.sendOtp(to);
		return { success: true, result };
	}

	@Post('verify-otp')
	async verifyOtp(@Body('to') to: string, @Body('code') code: string) {
		const result = await this.smsService.verifyOtp(to, code);
		return { success: true, result };
	}
}
