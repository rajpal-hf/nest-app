import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto , LoginDto } from './dto';
import * as argon from 'argon2'	
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	
	constructor(@InjectModel(User.name) private userModel: Model<User>,
		private jwt : JwtService	
	) { }

	async login(dto: LoginDto) {
		
		try {
			if (!dto.email || !dto.password) {
				return {
					HttpStatus: HttpStatus.BAD_REQUEST,
					msg: "All fields are required"
				}
			}
			const existingUser = await this.userModel.findOne({ email: dto.email })
			if (! existingUser) {
				return {
					HttpStatus: HttpStatus.BAD_REQUEST,
					msg: "User with this email not exist exists"
				}
			}
			// check password

			const passMatch = await argon.verify(existingUser.password.toString(), dto.password)
			
			console.log("passMatch ", passMatch)

			if(! passMatch) {
				return {
					HttpStatus: HttpStatus.BAD_REQUEST,
					msg: "Incorrect password"
				}
			}

			const token = await this.signToken(existingUser._id,existingUser.email.toString())

			return {
				HttpStatus: HttpStatus.OK,
				msg: "Login successful",
				user: existingUser,
				token
			}
		} catch (error) {

			console.log("Error in signup service", error)
			return {
				HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
				msg: "Error in signup service"
			}
		}

	}




	async signup(dto: AuthDto) {
		
		try {
			if(!dto.email || !dto.name || !dto.password) {
				return {
					HttpStatus : HttpStatus.BAD_REQUEST,
					msg: "All fields are required"
				}
			}
			const existingUser = await this.userModel.findOne({ email: dto.email })
			if (existingUser) {
				return {
					HttpStatus : HttpStatus.BAD_REQUEST,
					msg: "User already exists"
				}
			}
			const hashPass = await argon.hash(dto.password)
		console.log("hashed password", hashPass)

		const user = new this.userModel ({ 
			email: dto.email,
			name: dto.name,
			password : hashPass
		})

			console.log("https ", HttpStatus)

		await user.save()
			return {
			HttpStatus : HttpStatus.CREATED,
			user,
			msg: "User Created done "
		}
		} catch (error) {
			
			console.log("Error in signup service", error)
			return {
				HttpStatus : HttpStatus.INTERNAL_SERVER_ERROR,
				msg : "Error in signup service"
			}
		}
	}


	async signToken(userId: any, email: string) {
		const payload = {
			id: userId,
			email,
		}
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: process.env.JWT_SECRET,
		})

		return {
			access_token: token,
		}
	}
}
