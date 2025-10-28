import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	AuthDto,
	GetUserByIdDto,
	LoginDto,
	PaginationDto,
	UserFilterDto,
} from './dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { UserRole } from './schema/auth.schema';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth') // Swagger section name
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('signup')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User successfully registered' })
	@ApiResponse({ status: 400, description: 'Invalid input data' })
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@Post('signin')
	@ApiOperation({ summary: 'Login a user and return a JWT token' })
	@ApiResponse({ status: 200, description: 'User successfully logged in' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	signin(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	
	@Roles(UserRole.ADMIN)
	@Get('all-users')
	@ApiOperation({ summary: 'Get all users (Admin only)' })
	@ApiResponse({ status: 200, description: 'List of users returned' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
	@ApiBearerAuth()
	getAllUsers(
		@Query() pagination: PaginationDto,
		@Query() filter: UserFilterDto,
	) {
		return this.authService.getAllUsers(
			filter,
			pagination.page ?? 1,
			pagination.limit ?? 5,
		);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('get-user-by-id/:id')
	@ApiOperation({ summary: 'Get a single user by ID (Admin only)' })
	@ApiResponse({ status: 200, description: 'User details returned' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
	@ApiBearerAuth()
	getUserById(@Param() dto: GetUserByIdDto) {
		return this.authService.getUserById(dto);
	}
}
