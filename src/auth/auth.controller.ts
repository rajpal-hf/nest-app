import { Body, Controller, Get, Param, Post,Query,UseGuards	 } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto'
import { AuthGuard } from './guard/auth.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { UserRole } from './schema/auth.schema';
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { }
	
	@Post('signup')
	signup(@Body() dto :AuthDto ) {

		return this.authService.signup(dto)
	}	

	@Post('signin')
	signin(@Body() dto : LoginDto	) {
		return this.authService.login(dto)
	}


	@UseGuards(AuthGuard,RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('all-users')
	getAllUsers(
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	) {
		console.log("Fetching all users with pagination...");
		return this.authService.getAllUsers(
			page ? parseInt(page, 10) : 1,	
			limit ? parseInt(limit, 10) : 5,
		);
	}

	@Get('get-user-by-id/:id')
	getUserById(@Param('id') id: string) {
		return this.authService.getUserById(id);
	}
	}
