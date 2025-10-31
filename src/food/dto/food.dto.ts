import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from "class-validator";

export class CreateFoodDto {
	@ApiProperty({ description: "Restaurant ID", example: "64b8d8c4c9e6a3a0d8f0c123" })
	@IsMongoId()
	@IsNotEmpty()
	restaurant: string;

	@ApiProperty({ description: "Category ID", example: "64b8d8c4c9e6a3a0d8f0c999" })
	@IsMongoId()
	@IsNotEmpty()
	category: string;

	@ApiProperty({ description: "Name of the food", example: "Beef Burger" })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: "Food description", example: "Grilled beef patty with cheese", required: false })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ description: "Price of the food", example: 12.5 })
	@IsNumber()
	@IsNotEmpty()
	price: number;

	@ApiProperty({ description: "Available for catering", example: true, default: true })
	@IsBoolean()
	@IsOptional()
	available_for_catering?: boolean;
}
