import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Restaurant } from "src/restaurant/schema/restaurant.schema";
import { Category } from "src/category/schema/category.schema";

@Schema({ timestamps: true })
export class Food {

	@Prop({ type: Types.ObjectId, ref: "Restaurant", required: true })
	restaurant: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: "Category", required: true })
	category: Types.ObjectId; 

	@Prop({ type: String, required: true })
	name: string;
	@Prop({ type: String })
	description?: string;

	@Prop({ type: Number, required: true })
	price: number;

	@Prop({ type: Boolean, default: true })
	available_for_catering: boolean;

}

export const FoodSchema = SchemaFactory.createForClass(Food);

export type FoodDocument = HydratedDocument<Food>;