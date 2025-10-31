import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


@Schema({ timestamps: true })
export class Category {
	@Prop({ required: true , type: String,enum: ["Starter", "Main Course", "Dessert", "Beverage", "Alcohol"]})
	name: string;
	
}


export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryDocument = HydratedDocument<Category>;