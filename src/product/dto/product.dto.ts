import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddProductDto {

	@IsNotEmpty()
	@IsString()
	name: string;


	@IsNotEmpty()
	@IsString()
	description: string;


	@IsNotEmpty()
	@IsString()
	price: string;


	@IsNotEmpty()
	@IsString()
	currency: string;

	@IsNotEmpty()
	@IsString()
	stockQuantity: string;


	@IsOptional()
	@IsString()
	image?: string
	


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

export class ProductFilterDto {
	@IsOptional()
	@IsString()
	search?: string;
}
