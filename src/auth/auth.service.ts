import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	login() {
		return {
				msg : "Message from Service - User login" 
			}
	}
	signup() {
		return {
			msg: "Message from Service - user signed in"
		}
	}
}
