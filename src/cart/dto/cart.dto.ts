import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, Length } from "class-validator";
import { AddressDto } from "./address.dto";


export class CartItemDto {
	@ApiProperty({ example: '64b8f0c2e1d3c2a5f4a1b2c3', description: 'Product ID' })
	@IsString()
	productId: string;

	@ApiProperty({ example: 1, description: 'Quantity of the product' })
	@IsNumber()
	quantity: number;

	@ApiProperty({ example: 100, description: 'Price of the product at the time of adding' })
	@IsNumber()
	priceAtTime: number;
}

export class CartDto {
	@ApiProperty({ example: '64b8f0c2e1d3c2a5f4a1b2c3', description: 'ID of the user owning the cart' })
	userId: string;

	@ApiProperty({ example: [], description: 'List of items in the cart', type: [CartItemDto] })
	@IsArray()
	items: CartItemDto[];

	@ApiProperty({ example: 1500, description: 'Total amount of the cart before discounts' })
	totalAmount: number;

	@ApiProperty({ example: 100, description: 'Total discount applied to the cart' })
	totalDiscount: number;

	@ApiProperty({ example: 1400, description: 'Final amount to be paid after discounts' })
	finalAmount: number;
}

export class GetCartDto {
	@ApiProperty({ example: '64b8f0c2e1d3c2a5f4a1b2c3', description: 'ID of the user owning the cart' })
	@IsString()
	@IsNotEmpty()
	userId: string;
}

export class AddToCartDto {
	@ApiProperty({ example: 2, description: 'Quantity of the product to add' })
	@IsNumber()
	quantity: number;
}

export class CheckoutDto {
	@ApiProperty({ example: { street: '123 Main St', city: 'Springfield', zipCode: '12345' }, description: 'Shipping address' })
	@IsNotEmpty()
		@Type(() => AddressDto)
	address: AddressDto;

	@ApiProperty({ example: 'COD', description: 'Payment method, e.g. "COD" or "Card"' })
	@IsOptional()
	paymentMethod: string;
}



