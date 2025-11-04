import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
	@ApiProperty({
		example: 'scenebehind12@gmail.com',
		description: 'Recipient email address',
	})
	@IsEmail()
	@IsNotEmpty()
	to: string;

	@ApiProperty({
		example: 'Welcome to our platform!',
		description: 'Subject of the email',
	})
	@IsString()
	@IsNotEmpty()
	subject: string;

	@ApiProperty({
		example: '<h1>Hello, world!</h1>',
		description: 'HTML content of the email',
	})
	@IsString()
	@IsNotEmpty()
	html: string;
}
