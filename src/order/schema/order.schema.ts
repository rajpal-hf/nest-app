import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Product } from 'src/product/schema/product.schema';

export enum PaymentStatus {
	PENDING = 'pending',
	PAID = 'paid',
	FAILED = 'failed',
	REFUNDED = 'refunded',
}


@Schema({ timestamps: true })
export class Order {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	user: Types.ObjectId;
	@Prop([
		{
			product: { type: Types.ObjectId, ref: 'Product', required: true },
			quantity: { type: Number, required: true },
			price: { type: Number, required: true },
			afterDiscountPrice: { type: Number },
			discountPercent: { type: Number, default: 0 },
		},
	])
	items: {
		product: Types.ObjectId;
		quantity: number;
		price: number;
		afterDiscountPrice?: number;
		discountPercent?: number;
	}[];

	@Prop({ required: true })
	totalAmount: number;

	@Prop({ default: 0 })
	totalDiscount: number;

	@Prop({ required: true })
	finalAmount: number;

	@Prop({
		type: String,
		enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
		default: 'pending',
	})
	status: string;

	@Prop({
		type: String,
		enum: ['COD', 'ONLINE'],
		default: 'COD',
	})
	paymentMethod: string;

	@Prop({
		type: String,
		emun: Object.values(PaymentStatus),
		default: PaymentStatus.PENDING,
	})
	paymentStatus: PaymentStatus;

	@Prop({
		type: {
			street: { type: String, required: true },
			city: { type: String, required: true },
			zipCode: { type: String, required: true },
			state: { type: String },
			country: { type: String },
		},
		required: true,
	})
	shippingAddress: {
		street: string;
		city: string;
		zipCode: string;
		state?: string;
		country?: string;
	};


	@Prop({ default: null })
	expectedDelivery?: Date;

	@Prop({ default: null })
	deliveredAt?: Date;

	@Prop({ default: null })
	couponUsed?: string;

	@Prop({ default: 0 })
	couponDiscount?: number;

	@Prop({ default: null })
	cancelledAt?: Date;

	@Prop({
		type: String,
		enum: ['user', 'admin', null],
		default: null,
	})
		
	cancelledBy?: 'user' | 'admin' | null;

	@Prop({ default: null })
	cancelReason?: string;

	@Prop({
		type: String,
		enum: ['none', 'initiated', 'processed', 'completed'],
		default: 'none',
	})
	refundStatus: string;
}


export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);
