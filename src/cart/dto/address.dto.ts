import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class AddressDto {
	@ApiProperty({ example: '123 Main St' })
	@IsString()
	@IsNotEmpty()
	street: string;

	@ApiProperty({ example: 'Springfield' })
	@IsString()
	@IsNotEmpty()
	city: string;

	@ApiProperty({ example: '12345' })
	@IsString()
	@Length(3, 10)
	zipCode: string;

	@ApiProperty({ example: 'IL', required: false })
	@IsOptional()
	@IsString()
	state?: string;

	@ApiProperty({ example: 'USA', required: false })
	@IsOptional()
	@IsString()
	country?: string;
}