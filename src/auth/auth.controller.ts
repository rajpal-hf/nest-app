import { Body, Controller, Get, Param, ParseIntPipe, Post,Query,UseGuards	 } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, GetUserByIdDto, LoginDto, PaginationDto, UserFilterDto } from './dto'
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
		@Query() dto: PaginationDto,
	) {
		return this.authService.getAllUsers(
			dto.page ? dto.page : 1,
			dto.limit ? dto.limit : 5,
		);
	}


	@Get('get-user-by-id/:id')
	getUserById(@Param() dto: GetUserByIdDto) {
		return this.authService.getUserById(dto);
	}

	@Get('filter-users')
	filterUsers(@Query() dto: UserFilterDto) {
		return this.authService.filterUsers(dto);
	}



	

	}
