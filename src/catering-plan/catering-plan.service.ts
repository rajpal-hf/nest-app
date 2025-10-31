import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CateringPlan, CateringPlanDocument } from './schema/cateringPlan.schema';
import { CreateCateringPlanDto } from './dto';

@Injectable()
export class CateringPlanService {
	constructor(
		@InjectModel(CateringPlan.name) private cateringPlanModel: Model<CateringPlanDocument>,
	) { }

	async create(dto: CreateCateringPlanDto) {
		
		try {
			console.log("DTO received in service:", dto);
			const plan = new this.cateringPlanModel(dto);
		
			return {
				message: 'Catering plan created successfully',
				plan,
			}
		} catch (error) {
			
		}
		
	}

	async findAll() {
		return this.cateringPlanModel
			.find()
			.populate('restaurant')
			.populate('menu_items.food')
			.exec();
	}

	
}
