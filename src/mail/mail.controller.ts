import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailDto } from './dto/mail.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) { }

	@Post('send')
	@ApiOperation({ summary: 'Send an email' })
	@ApiResponse({ status: 200, description: 'Email sent successfully' })
	@ApiResponse({ status: 500, description: 'Failed to send email' })
	async sendMail(@Body() mailDto: MailDto) {
		return this.mailService.sendMail(mailDto.to, mailDto.subject, mailDto.html);
	}
}
