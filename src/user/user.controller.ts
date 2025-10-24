import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('user')

	
export class UserController {
	@Get('me')
		@UseGuards(AuthGuard('jwt'))
	getUsers(@Req() req : Request) {
		return "This is user controller"
	}
}
