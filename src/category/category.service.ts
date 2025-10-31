import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
	) { }

	async create(createCategoryDto) {
		try {
			const { name } = createCategoryDto;

			// add Check Here ki koi category same name naal exist na krdi hove with same Admin


			const category = new this.categoryModel({ name });
			category.save();
			return {
				message: 'Category created successfully',
				category,
			}
		} catch (error) {
			console.error('Error creating category:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal server error', 500);
		}
		
	}

	async findAll(): Promise<Category[]> {
		return this.categoryModel.find().exec();
	}
	//findOne 

	//Removve kr sakda

	// Hor Pta ni 
	
}
