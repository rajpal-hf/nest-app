import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
	@ApiProperty({
		description: "The category name",
		enum: ["Starter", "Main Course", "Dessert", "Beverage", "Alcohol"],
		example: "Starter",
	})
	@IsNotEmpty()
	@IsEnum(["Starter", "Main Course", "Dessert", "Beverage", "Alcohol"])
	name: string;
}
