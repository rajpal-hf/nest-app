// export interface AuthDto {
// 	email: string,
// 	password: string
// }

import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class AuthDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	password: string;

}

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	password: string;
}