// creating a schema for resturent with name Email type and phonenumber 

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true, unique: true })
	phoneNumber: string;

	@Prop({ required: true })
	address: string;

	@Prop({ default: false })
	isCateringServiceProvider: boolean;
}	

export type RestaurantDocument = HydratedDocument<Restaurant>;

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);