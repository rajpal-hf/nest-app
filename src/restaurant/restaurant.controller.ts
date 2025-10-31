import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { UserRole } from 'src/auth/schema/auth.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('restaurant')
export class RestaurantController {
	constructor (private readonly restaurantService: RestaurantService) {}
	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
		@ApiBearerAuth()
	createRestaurant(@Body() body: CreateRestaurantDto) {
		return this.restaurantService.createRestaurant(body);
	}
}
