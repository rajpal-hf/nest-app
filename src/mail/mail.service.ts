import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
	private transporter: nodemailer.Transporter;


	constructor() {

		const EMAIL_HOST  = process.env.EMAIL_HOST

		const EMAIL_USERNAME = process.env.EMAIL_USERNAME

		const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

		console.log("->>>>>>>>>>>>>>>>",EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD)

		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST ,
		
			auth: {
				user: process.env.EMAIL_USERNAME ,
				pass: process.env.EMAIL_PASSWORD 
			},
		});
	}

	async sendMail(to: string, subject: string, html: string) {
		try {
			const info = await this.transporter.sendMail({
				from: `"No Reply" <${process.env.EMAIL_USERNAME}>`,
				to,
				subject,
				html,
			});

			console.log('Message sent: %s', info.messageId);
			return { messageId: info.messageId, accepted: info.accepted };
		} catch (err) {
			console.log("Error in Sending email"  , err	)
			throw new InternalServerErrorException('Failed to send email: ' + err.message);
		}
	}
}
