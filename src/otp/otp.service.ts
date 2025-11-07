import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Otp, OtpDocument } from './schema/otp.schema';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { EmailDto } from './dto/otp.dto';

@Injectable()
export class OtpService {
	private readonly logger = new Logger(OtpService.name);
	private transporter: nodemailer.Transporter;

	constructor(
		@InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly configService: ConfigService,
	) {
		// initialize mail transporter
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST ,
		
			auth: {
				user: process.env.EMAIL_USERNAME ,
				pass: process.env.EMAIL_PASSWORD 
			},
		});
	}

	


	
	async sendOtp(dto : EmailDto) {
		try {
			//  Check if user exists
			const {email} = dto	
			if (await this.userExists(email)) {
				throw new HttpException(
					'User already exists with this email',
					HttpStatus.CONFLICT,
				);
			}

			//  Generate unique OTP
			const otp = await this.generateUniqueOtp();
			// Save OTP to DB
			await this.saveOtp(email, otp);

			// Send OTP via email
			await this.sendMail(
				email,
				'Verification Email from LearnJet',
				`<h3>Your OTP is: <b>${otp}</b></h3>`,
			);

			return {
				success: true,
				msg: 'OTP sent successfully. Please check your email and verify.',
			};
		} catch (error) {
			this.logger.error('Error in sendOtp', error.stack);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// ----------------------
	// Helper methods
	// ----------------------

	private async userExists(email: string): Promise<boolean> {
		const user = await this.userModel.findOne({ email });
		return !!user;
	}

	private async generateUniqueOtp(): Promise<string> {
		let otp = otpGenerator.generate(6, {
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		});

		while (await this.otpModel.findOne({ otp })) {
			otp = otpGenerator.generate(6, {
				lowerCaseAlphabets: false,
				upperCaseAlphabets: false,
				specialChars: false,
			});
		}

		return otp;
	}

	private async saveOtp(email: string, otp: string): Promise<void> {
		const otpPayload = new this.otpModel({ email, otp });
		await otpPayload.save();
	}

	private async sendMail(email: string, subject: string, html: string) {
		try {
			const info = await this.transporter.sendMail({
				from: 'noreply@henceforth.com',
				to: email,
				subject,
				html,
			});
			this.logger.log(`Mail sent successfully to ${email}`);
			return info;
		} catch (error) {
			this.logger.error('Error sending email', error.stack);
			throw error;
		}
	}
}
















// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as otpGenerator from 'otp-generator';
// import { Otp, OtpDocument } from './schema/otp.schema';
// import { User, UserDocument } from 'src/auth/schema/auth.schema';


// @Injectable()
// export class OtpService {
// 	MailSenderService: any;
// 	constructor(
// 		@InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
// 		@InjectModel(User.name) private userModel: Model<UserDocument>,
// 	) { }

// 	async sendOtp(email: string) {
// 		try {
// 			// check user already exist
// 			const userExist = await this.userModel.findOne({ email });
// 			if (userExist) {
// 				throw new HttpException('User already exists with this email', HttpStatus.CONFLICT);
// 			}

// 			// generate otp
// 			let otp = otpGenerator.generate(6, {
// 				lowerCaseAlphabets: false,
// 				upperCaseAlphabets: false,
// 				specialChars: false,
// 			});

// 			// ensure unique OTP
// 			let result = await this.otpModel.findOne({ otp });
// 			while (result) {
// 				otp = otpGenerator.generate(6, {
// 					lowerCaseAlphabets: false,
// 					upperCaseAlphabets: false,
// 					specialChars: false,
// 				});
// 				result = await this.otpModel.findOne({ otp });
// 			}

// 			// save otp to DB
// 			const otpPayload = new this.otpModel({ email, otp });
// 			await otpPayload.save();

// 			// send mail
// 			await this.MailSenderService.sendMail(
// 				email,
// 				'Verification Email from LearnJet',
// 				`<h3>Your OTP is: <b>${otp}</b></h3>`
// 			);

// 			return {
// 				success: true,
// 				msg: 'OTP sent successfully. Please check your email and verify.',
// 			};
// 		} catch (error) {
// 			console.error('Error in sendOtp:', error);
// 			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
// 		}
// 	}

	
// }
