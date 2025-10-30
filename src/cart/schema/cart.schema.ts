import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument, Types } from 'mongoose';
import { User } from '../../auth/schema/auth.schema';
import { Product } from '../../product/schema/product.schema';


@Schema({ timestamps: true })
export class Cart {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	user: Types.ObjectId;

	@Prop([
		{
			product: { type: Types.ObjectId, ref: 'Product', required: true },
			quantity: { type: Number, required: true, min: 1 },
			priceAtTime: { type: Number, required: true }
			
		},
	])
	items: {
		product: Types.ObjectId;
		quantity: number;
		priceAtTime: number;
	}[];

	@Prop({ default: 0 })
	totalAmount: number;

	@Prop({ default: 0 })
	totalDiscount: number;

	@Prop({ default: 0 })
	finalAmount: number; 

	@Prop({ default: false })
	isCheckedOut: boolean;

	@Prop({ default: null })
	couponCode?: string;

	@Prop({ default: 0 })
	couponDiscount?: number;
}

export type CartDocument = HydratedDocument<Cart>;

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.pre('save', function (next) {
    const total = this.items.reduce(
        (sum, item) => sum + item.priceAtTime * item.quantity,
        0,
    );

    let discount = 0;
																																																													
    if (this.couponDiscount) {
        discount = (this.couponDiscount / 100) * total;
    }

    this.totalAmount = total;
    this.totalDiscount = discount;
    this.finalAmount = this.totalAmount - this.totalDiscount;

    next();
});


