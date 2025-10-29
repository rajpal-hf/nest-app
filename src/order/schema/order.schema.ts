import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
class Order {
	@Prop({ required: true, trim: true })
	customerName: string;

	@Prop({ required: true, trim: true })
	customerEmail: string;

	@Prop({ required: true })
	orderDate: Date;

	@Prop({ required: true, type: [{ productId: String, quantity: Number }] })
	products: { productId: string; quantity: number }[];

	@Prop({ required: true })
	totalAmount: number;

	@Prop({ default: 'Pending' })
	status: string;		
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);