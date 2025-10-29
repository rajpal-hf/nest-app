import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Product {
	@Prop({ required: true, trim: true })
	name: string;

	@Prop({ required: true, trim: true })
	description: string;

	@Prop({ required: true })
	price: number;

	@Prop()
	stockQuantity: number;

	@Prop({ default: true })
	inStock: boolean;																																			

	@Prop({ required: true, trim: true })
	currency: string;
	@Prop()
	image:string
	
}
export type ProductDocument = HydratedDocument<Product>;


export const ProductSchema = SchemaFactory.createForClass(Product);