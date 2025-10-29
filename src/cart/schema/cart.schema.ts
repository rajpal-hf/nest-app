import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Cart {
	@Prop({ required: true })
	userId: string;

	@Prop({ required: true, type: [{ productId: String, quantity: Number }] })
	items: { productId: string; quantity: number }[];

	@Prop({ required: true })
	totalPrice: number;

}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);