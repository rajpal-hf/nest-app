import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer"

export class MailSenderService {
	private readonly logger = new Logger(MailSenderService.name);
	private transporter: nodemailer.Transporter;

	constructor(private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			host: this.configService.get<string>('MAIL_HOST'),
			auth: {
				user: this.configService.get<string>('MAIL_USER'),
				pass: this.configService.get<string>('MAIL_PASS'),
			},
		});
	}

	async sendMail(email: string, title: string, body: string) {
		try {
			const info = await this.transporter.sendMail({
				from: 'noreply.@henceforth.com',
				to: email,
				subject: title,
				html: body,
			});

			this.logger.log(`Mail sent successfully to ${email}`);
			return info;
		} catch (error) {
			this.logger.error('Error sending email', error.stack);
			throw error;
		}
	}
}
