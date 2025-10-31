import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsBoolean,
	IsNotEmpty,
	Matches,
} from 'class-validator';

export class CreateRestaurantDto {
	@ApiProperty({
		example: 'Manchurian Palace',
		description: 'Name of the restaurant',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		example: '123 Main St, Cityville',
		description: 'Address of the restaurant',
	})
	@IsString()
	@IsNotEmpty()
	address: string;

	@ApiProperty({
		example: 'contact@manchurianpalace.com',
		description: 'Email address of the restaurant',
	})
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@ApiProperty({
		example: '+1-555-123-4567',
		description: 'Phone number of the restaurant',
	})
	@IsString()
	@Matches(/^[+\d]?(?:[\d-.\s()]*)$/, {
		message: 'Invalid phone number format',
	})
	phoneNumber: string;

	@ApiProperty({
		example: true,
		description: 'Indicates whether the restaurant offers catering services',
	})
	@IsBoolean()
	isCateringServiceProvider: boolean;
}
