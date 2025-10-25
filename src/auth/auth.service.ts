import { HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { User, UserDocument } from './schema/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) { }

	async onApplicationBootstrap() {
		const admin = await this.userModel.findOne({ email: 'admin@example.com' });

		if (!admin) {
			const hashedPassword = await bcrypt.hash('admin123', 10);
			await this.userModel.create({
				name: 'Admin ',
				email: 'admin@example.com',
				password: hashedPassword,
				role: 'admin',
			});
			console.log('✅ Default admin created: admin@example.com / admin123');
		}
	}
}

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private jwt: JwtService,
	) { }

	async signup(dto: AuthDto) {
		try {
			if (!dto.email || !dto.name || !dto.password) {
				return {
					status: HttpStatus.BAD_REQUEST,
					msg: 'All fields are required',
				};
			}

			const existingUser = await this.userModel.findOne({ email: dto.email });
			if (existingUser) {
				return {
					status: HttpStatus.BAD_REQUEST,
					msg: 'User already exists',
				};
			}

			const hashPass = await argon.hash(dto.password);

			const user = new this.userModel({
				email: dto.email,
				name: dto.name,
				password: hashPass,
			});

			await user.save();

			return {
				status: HttpStatus.CREATED,
				msg: 'User created successfully',
				user,
			};
		} catch (error) {
			console.error('❌ Error in signup service:', error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				msg: 'Error in signup service',
			};
		}
	}

	async login(dto: LoginDto) {
		try {
			if (!dto.email || !dto.password) {
				return {
					status: HttpStatus.BAD_REQUEST,
					msg: 'All fields are required',
				};
			}

			const existingUser = await this.userModel.findOne({ email: dto.email });
			if (!existingUser) {
				return {
					status: HttpStatus.BAD_REQUEST,
					msg: 'User with this email does not exist',
				};
			}

			const passMatch = await argon.verify(
				existingUser.password.toString(),
				dto.password,
			);

			if (!passMatch) {
				return {
					status: HttpStatus.BAD_REQUEST,
					msg: 'Incorrect password',
				};
			}

			const token = await this.signToken(
				existingUser._id,
				existingUser.email.toString(),
			);

			return {
				status: HttpStatus.OK,
				msg: 'Login successful',
				user: existingUser,
				token,
			};
		} catch (error) {
			console.error('❌ Error in login service:', error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				msg: 'Error in login service',
			};
		}
	}

	async signToken(userId: any, email: string) {
		const payload = { id: userId, email };

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: process.env.JWT_SECRET,
		});

		return { access_token: token };
	}
}
