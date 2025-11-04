import { Injectable, InternalServerErrorException } from '@nestjs/common';
import twilio, { Twilio } from 'twilio';

@Injectable()
export class SmsService {
	private client: Twilio;
	private readonly accountSid = process.env.TWILIO_ACCOUNT_SID;
	private readonly authToken = process.env.TWILIO_AUTH_TOKEN;
	private readonly fromNumber = process.env.TWILIO_PHONE_NUMBER;
	private readonly verifyServiceSid = process.env.VERIFY_SERVICE_SID

	constructor() {
		this.client = twilio(this.accountSid, this.authToken);
	}

	// Send regular SMS
	async sendSms(to: string, body: string) {
		try {
			const message = await this.client.messages.create({
				body,
				from: this.fromNumber,
				to,
			});
			console.log("-->>>>>>>>>>>",message)
			return { sid: message.sid, status: message.status };
		} catch (error) {
			throw new InternalServerErrorException(`Failed to send SMS: ${error.message}`);
		}
	}

	// Send OTP using Twilio Verify
	async sendOtp(to: string) {
		if (!this.verifyServiceSid) {
			throw new InternalServerErrorException('Missing TWILIO_VERIFY_SERVICE_SID');
		}

		try {
			const verification = await this.client.verify.v2
				.services(this.verifyServiceSid)
				.verifications.create({ to, channel: 'sms' });

			return { status: verification.status };
		} catch (error) {
			throw new InternalServerErrorException(`Failed to send OTP: ${error.message}`);
		}
	}

	// Verify OTP
	async verifyOtp(to: string, code: string) {
		if (!this.verifyServiceSid) {
			throw new InternalServerErrorException('Missing TWILIO_VERIFY_SERVICE_SID');
		}

		try {
			const verificationCheck = await this.client.verify.v2
				.services(this.verifyServiceSid)
				.verificationChecks.create({ to, code });

			return { status: verificationCheck.status, valid: verificationCheck.valid };
		} catch (error) {
			throw new InternalServerErrorException(`Failed to verify OTP: ${error.message}`);
		}
	}
}
