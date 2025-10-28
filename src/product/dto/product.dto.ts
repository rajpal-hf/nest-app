import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddProductDto {
	@ApiProperty({
		description: 'Name of the product',
		example: 'Apple iPhone 15 Pro',
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		description: 'Detailed description of the product',
		example: 'Latest iPhone with A17 Pro chip and titanium frame',
	})
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty({
		description: 'Price of the product',
		example: 1299.99,
	})
	@IsNotEmpty()
	@IsNumber()
	price: number;

	@ApiProperty({
		description: 'Product availability status',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	inStock: boolean;

	@ApiProperty({
		description: 'Currency code for the product price',
		example: 'USD',
	})
	@IsNotEmpty()
	@IsString()
	currency: string;
}

export class UpdateProductDto {
	@ApiPropertyOptional({
		description: 'Name of the product',
		example: 'Samsung Galaxy S25 Ultra',
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({
		description: 'Description of the product',
		example: 'Flagship Samsung smartphone with 200MP camera',
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({
		description: 'Updated product price',
		example: 1199.99,
	})
	@IsOptional()
	@IsNumber()
	price?: number;

	@ApiPropertyOptional({
		description: 'Whether the product is in stock',
		example: false,
	})
	@IsOptional()
	@IsBoolean()
	inStock?: boolean;

	@ApiPropertyOptional({
		description: 'Currency code',
		example: 'EUR',
	})
	@IsOptional()
	@IsString()
	currency?: string;
}
