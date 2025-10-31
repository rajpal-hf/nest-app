import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CateringPlanService } from "./catering-plan.service";
import { CreateCateringPlanDto } from "./dto";
import { CateringPlan } from "./schema/cateringPlan.schema";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { RolesGuard } from "src/roleGuard/roles.guard";
import { Roles } from "src/roleGuard/roles.decorator";
import { UserRole } from "src/auth/schema/auth.schema";


@ApiTags("Catering Plans")
	@Controller("catering-plans")
@ApiBearerAuth()
	@UseGuards(AuthGuard ,RolesGuard)
	@Roles(UserRole.ADMIN)
export class CateringPlanController {
	constructor(private readonly cateringPlanService: CateringPlanService) { }

	@Post()
	@ApiOperation({ summary: "Create a new catering plan" })
	@ApiResponse({ status: 201, description: "Catering plan created successfully", type: CateringPlan })
	create(@Body() createDto: CreateCateringPlanDto) {
		return this.cateringPlanService.create(createDto);
	}

	@Get()
	@ApiOperation({ summary: "Retrieve all catering plans" })
	@ApiResponse({ status: 200, description: "List of all catering plans", type: [CateringPlan] })
	findAll() {
		return this.cateringPlanService.findAll();
	}

	//findOne

	//update

	//delete
}
