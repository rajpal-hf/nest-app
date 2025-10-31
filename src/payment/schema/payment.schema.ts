import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { PaymentStatus } from "src/order/schema/order.schema";

@Schema()
export class Payment {
	@Prop({required: true , type: Types.ObjectId, ref: 'Order'})
	orderId: Types.ObjectId;
	
	@Prop({ required: true , type: Types.ObjectId, ref: 'User'})
	userId: Types.ObjectId;
	
	@Prop({ required: true })
	amount: number;

	@Prop({ required: true })
	paymentMethod: string;

	@Prop({ required: true, default: Date.now })
	paymentDate: Date;

	@Prop({ required: true , enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
	status: PaymentStatus;
}

export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentSchema = SchemaFactory.createForClass(Payment);