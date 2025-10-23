import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
	signup() {
		return this.authService.signup()
	}

	@Post('signin')
	signin() {
		return this.authService.login()
	}
	
}
