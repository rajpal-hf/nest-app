import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto'
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) { }

	// ^
	// |
	// Short hand for this  ;

// 	authService : AuthService
// 	constructor(authService: AuthService) {
// 		this.authService = authService
// }

	
	@Post('signup')
	signup(@Body() dto :AuthDto ) {

		return this.authService.signup(dto)
	}	

	@Post('signin')
	signin(@Body() dto : LoginDto	) {
		return this.authService.login(dto)
	}
	
}
