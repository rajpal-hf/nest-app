import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailDto } from './dto/otp.dto';

@Controller('otp')
export class OtpController {
	constructor(private readonly otpService: OtpService) { }

	@Post('send')
	async sendOtp(@Body() email: any) {
		console.log(email)
		return await this.otpService.sendOtp(email);
	}
}
