import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { FoodService } from "./food.service";
import { Food } from "./schema/food.schema";
import { CreateFoodDto } from "./dto";
import { Roles } from "src/roleGuard/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roleGuard/roles.guard";

@ApiTags("Foods")


@Controller("foods")
export class FoodController {
	constructor(private readonly foodService: FoodService) { }

	@Post()
	@ApiOperation({ summary: "Create a new food item" })
	@ApiResponse({ status: 201, description: "Food created successfully", type: Food })
	create(@Body() createFoodDto: CreateFoodDto) {
		return this.foodService.create(createFoodDto);
	}

	@Get()
	@ApiOperation({ summary: "Retrieve all food items" })
	@ApiResponse({ status: 200, description: "List of all food items", type: [Food] })
	findAll() {
		return this.foodService.findAll();
	}

	//findOne

	//update

	//delete
}
