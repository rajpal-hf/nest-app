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
import { CategoryService } from "./category.service";
import { Category } from "./schema/category.schema";
import { CreateCategoryDto } from "./dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { RolesGuard } from "src/roleGuard/roles.guard";
import { Roles } from "src/roleGuard/roles.decorator";
import { UserRole } from "src/auth/schema/auth.schema";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) { }

	@Post()
	@ApiOperation({ summary: "Create a new category" })
	@ApiResponse({ status: 201, description: "Category created successfully", type: Category })
	create(@Body() createCategoryDto: CreateCategoryDto) {

		return this.categoryService.create(createCategoryDto);
	}

	@Get()
		
	@ApiOperation({ summary: "Retrieve all categories" })
	@ApiResponse({ status: 200, description: "List of all categories", type: [Category] })
	findAll() {
		return this.categoryService.findAll();
	}
}
