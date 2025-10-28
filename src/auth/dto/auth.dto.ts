// export interface AuthDto {
// 	email: string,
// 	password: string
// }

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserGender, UserStatus } from "../schema/auth.schema";
import { ApiProperty } from "@nestjs/swagger";


export class AuthDto {
	@ApiProperty({ description: 'The name of the user', example: 'John bro' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ description: 'The email of the user', example: 'john.bro@gmail.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ description: 'The password of the user', example: '111111' })
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@ApiProperty({enum: ['male', 'female', 'other'], description: 'The gender of the user', example: 'male' })
	@IsString()
	gender?: UserGender;

	@ApiProperty({ description: 'The status of the user', example: 'active' })
	@IsOptional()
	status?: UserStatus;


	@ApiProperty({ description: 'The phone number of the user', example: '1234567890' })
	@IsString()
	@IsNotEmpty()
	phone: string;
}

export class LoginDto {
	@ApiProperty({ description: 'The email of the user', example: 'admin@gmail.com' , })
	@IsEmail()
	@IsNotEmpty()
	email: string;


	@ApiProperty({ description: 'The password of the user', example: 'admin123' })
	@IsString()
	password: string;
}

export class GetUserByIdDto {
	@ApiProperty({
		description: 'The ID of the user', example: '68ff5d80d3c0cd44b746bb99' })
	@IsString()
	id: string;
}

export class PaginationDto {
	@ApiProperty({ description: 'Page number for pagination', example: 1 })	
	@IsOptional()
	page?: number;

	@ApiProperty({ description: 'Number of users per page for pagination', example: 10 })
	@IsOptional()
	limit?: number;
}

export class UserFilterDto {
	@ApiProperty({ description: 'Filter by name', example: 'John' })
	@IsOptional()
	saerch?: string;

	// @ApiProperty({ description: 'Filter by email', example: 'john@example.com' })
	// @IsOptional()
	// email?: string;

	// @ApiProperty({ description: 'Filter by phone number', example: '1234567890' })
	// @IsOptional()
	// phone?: string;

	@ApiProperty({ description: 'Filter by phone number', example: '1234567890' })
	@IsOptional()
	status?: string;

}
