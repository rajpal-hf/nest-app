import { HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthDto, GetUserByIdDto, LoginDto, UserFilterDto } from './dto';
import * as argon from 'argon2';
import { User, UserDocument } from './schema/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwt: JwtService,
	) {}

	// ``````````````````````````````````````````````````` Default Admin ```````````````````````````````````````````````````````
	async onApplicationBootstrap() {
		const admin = await this.userModel.findOne({ email: 'admin@gmail.com' });

		if (!admin) {
			const hashedPassword = await argon.hash('admin123');
			await this.userModel.create({
				name: 'Admin',
				phone :'1234567890',
				email: 'admin@gmail.com',
				password: hashedPassword,
				role: 'admin',
			});
			console.log('Default admin created: admin@gmail.com / admin123');
		}
	}

	// ``````````````````````````````````````````````````` Signup ```````````````````````````````````````````````````````
	async signup(dto: AuthDto) {
		console.log('🚀 Signup DTO:', dto);
		try {
			if (!dto.email || !dto.name || !dto.password || !dto.phone) {
				throw new Error('All fields are required');
			}

			const existingUser = await this.userModel.findOne({ email: dto.email });
			if (existingUser) {
				throw new Error('User with this email already exists');
			}

			const hashPass = await argon.hash(dto.password);

			const user = new this.userModel({
				email: dto.email,
				name: dto.name,
				password: hashPass,
				phone:dto.phone

			});

			await user.save();

			return {
				status: HttpStatus.CREATED,
				msg: 'User created successfully',
				user,
			};
		} catch (error) {
			console.error('Error in signup service:', error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				msg: 'Error in signup service',
			};
		}
	}

	// ``````````````````````````````````````````````````` Login ```````````````````````````````````````````````````````
	async login(dto: LoginDto) {
		try {
			if (!dto.email || !dto.password) {
				throw new Error('Email and password are required');
			}

			const existingUser = await this.userModel.findOne({ email: dto.email });
			if (!existingUser) {
				throw new Error('User not found');
			}

			const passMatch = await argon.verify(
				existingUser.password.toString(),
				dto.password,
			);

			if (!passMatch) {
				throw new Error('Invalid credentials');
			}

			const token = await this.signToken(
				existingUser._id,
				existingUser.email.toString(),
				existingUser.role.toString(),
				existingUser.name.toString(),
			);

			return {
				status: HttpStatus.OK,
				msg: 'Login successful',
				user: existingUser,
				token,
			};
		} catch (error) {
			console.error('Error in login service:', error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				msg: 'Error in login service',
			};
		}
	}

	// ``````````````````````````````````````````````````` JWT Sign ```````````````````````````````````````````````````````
	async signToken(userId: any, email: string, role: string, name: string) {
		const payload = { id: userId, email, role, name };
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '1d',
			secret: process.env.JWT_SECRET,
		});
		return { access_token: token };
	}


	// ``````````````````````````````````````````````````` Get All Users ````````````````````````````````````````````````````````
// 	async getAllUsers(page: number, limit: number) {
// 		try {
	
			
// 			const filter = { role: { $ne: 'admin' } };

// 			const skip = (page - 1) * limit;


// 			const totalUsers = await this.userModel.countDocuments(filter);

// 			const users = await this.userModel
// 				.find(filter)
// 				.skip(skip)
// 				.limit(limit)
// 				.sort({ createdAt: -1 }); 

// 			if (!users.length) {
// 				return {
// 					status: HttpStatus.NOT_FOUND,
// 					msg: 'No users found',
// 				};
// 			}

// 			return {
// 				status: HttpStatus.OK,
// 				msg: 'Users retrieved successfully',
// 				page,
// 				limit,
// 				totalUsers,
// 				totalPages: Math.ceil(totalUsers / limit),
// 				users,
// 			};
// 		} catch (error) {
// 			console.error('Error fetching paginated users:', error);
// 			return {
// 				status: HttpStatus.INTERNAL_SERVER_ERROR,
// 				msg: 'Error fetching users',
// 			};
// 		}
// 	}





// async filterUsers(dto: UserFilterDto) {
//   try {
//     const { email, phone, name,status } = dto;

//     const filter: Record<string, any> = {};

//     if (name) filter.name = { $regex: name, $options: 'i' };
//     if (email) filter.email = { $regex: email, $options: 'i' };
//     if (phone) filter.phone = { $regex: phone, $options: 'i' };
//     if (status) filter.status = { $regex: status, $options: 'i' };

//     if (Object.keys(filter).length === 0) {
//       return {
//         status: HttpStatus.BAD_REQUEST,
//         msg: 'Please provide at least one filter field (name, email, or phone)',
//       };
//     }

//     const users = await this.userModel.find(filter).exec();

//     if (!users.length) {
//       return {
//         status: HttpStatus.NOT_FOUND,
//         msg: 'No users found matching your criteria',
//       };
//     }

//     return {
//       status: HttpStatus.OK,
//       msg: 'Users retrieved successfully',
//       count: users.length,
//       users,
//     };
//   } catch (error) {
//     console.error('Error in filterUser service:', error);
//     return {
//       status: HttpStatus.INTERNAL_SERVER_ERROR,
//       msg: 'Error in filterUser service',
//     };
//   }
// }


async getAllUsers(dto: UserFilterDto, page: number, limit: number) {
  try {
    const { search } = dto;
		
    const filter: Record<string, any> = { role: { $ne: 'admin' } };


    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const totalUsers = await this.userModel.countDocuments(filter);

    
    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!users.length) {
      return {
        status: HttpStatus.NOT_FOUND,
        msg: search
          ? 'No users found matching your search criteria'
          : 'No users found',
      };
    }

    return {
      status: HttpStatus.OK,
      msg: 'Users retrieved successfully',
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: 'Error fetching users',
    };
  }
}


// ``````````````````````````````````````````````````` Get User by id `````````````````````````````````````````````````````````````

	async getUserById(dto: GetUserByIdDto) {
		const user = await this.userModel.findById(dto.id);
		if (!user) {
			return {
				status: HttpStatus.NOT_FOUND,
				msg: 'User not found',
			};
		}
		return {
			status: HttpStatus.OK,
			msg: 'User retrieved successfully',
			user,
		};
	}
	


}

