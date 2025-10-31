import { HttpException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';

@Injectable()
export class RestaurantService {

	constructor(
		@InjectModel(Restaurant.name) private  restaurantModel : Model<RestaurantDocument>
	) {}

	async createRestaurant(body: CreateRestaurantDto) {
		try {
			const { name, address, email, phoneNumber, isCateringServiceProvider } = body;

			if(!name || !address || !email || !phoneNumber) {
				throw new HttpException('Missing required fields', 400);
			}
			
			const checkRestaurantExists = await this.restaurantModel.findOne({ email });
			if (checkRestaurantExists) {
				throw new HttpException('Restaurant with this email already exists', 409);
			}

			const newRestaurant = new this.restaurantModel({
				name,
				address,
				email,
				phoneNumber,
				isCateringServiceProvider: isCateringServiceProvider || false
			});

			await newRestaurant.save();

			return {
				newRestaurant,
				message: 'Restaurant created successfully'
			};
		} catch (error) {
			console.error('Error in createRestaurant:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal Server Error', 500);
		}
		
	}
}
