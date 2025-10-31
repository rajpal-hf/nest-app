import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, } from './schema/food.schema';
import { CreateFoodDto } from './dto';

@Injectable()
export class FoodService {
	constructor(
		@InjectModel(Food.name) private foodModel: Model<Food>,
	) { }

	async create(dto :CreateFoodDto) {
		try {
			const food = new this.foodModel(dto);
			await food.save();
			return {
				message: 'Food created successfully',
				food,
			}
		} catch (error) {
			console.error('Error creating food:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal server error',500);
		}
	
	}
	async findAll(): Promise<Food[]> {
		return this.foodModel.find().populate('restaurant category').exec();
	}

}
