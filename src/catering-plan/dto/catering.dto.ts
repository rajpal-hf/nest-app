import { ApiProperty } from "@nestjs/swagger";
import {
	IsMongoId,
	IsNotEmpty,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
	Min,
	ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";
import { PlanNames } from "../schema/cateringPlan.schema";

class MenuItemDto {
	@ApiProperty({ description: "Food ID", example: "64b8d8c4c9e6a3a0d8f0c456" })
	@IsMongoId()
	@IsNotEmpty()
	food: string;

	@ApiProperty({ description: "Quantity of this food item", example: 2, default: 1 })
	@IsNumber()
	@Min(1)
	quantity: number;
}

export class CreateCateringPlanDto {
	@ApiProperty({ description: "Restaurant ID", example: "64b8d8c4c9e6a3a0d8f0c123" })
	@IsMongoId()
	@IsNotEmpty()
	restaurant: string;

	@ApiProperty({ description: "Plan name", enum: PlanNames, example: PlanNames.Basic })
	@IsEnum(PlanNames)
	@IsNotEmpty()
	name: PlanNames;

	@ApiProperty({ description: "Price per person", example: 15.99 })
	@IsNumber()
	@IsNotEmpty()
	price_per_person: number;

	@ApiProperty({ description: "Minimum number of people", example: 5, required: false })
	@IsOptional()
	@IsNumber()
	min_people?: number;

	@ApiProperty({ description: "Maximum number of people", example: 50, required: false })
	@IsOptional()
	@IsNumber()
	max_people?: number;

	@ApiProperty({ description: "Description of the catering plan", example: "Perfect for office events", required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		description: "List of food items included in the plan",
		type: [MenuItemDto],
		example: [{ food: "64b8d8c4c9e6a3a0d8f0c456", quantity: 2 }],
	})
	@ValidateNested({ each: true })
	@Type(() => MenuItemDto)
	@ArrayMinSize(1)
	menu_items: MenuItemDto[];
}
