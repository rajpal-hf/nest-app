import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schema/auth.schema';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
	@Prop({ required: true, unique: true, trim: true, uppercase: true })
	code: string; 

	@Prop({ type: String, enum: ['percentage', 'fixed'], required: true })
	discountType: 'percentage' | 'fixed';

	@Prop({ required: true })
	discountValue: number; 

	@Prop({ default: 0 })
	maxDiscountAmount?: number;

	@Prop({ default: 0 })
	minOrderAmount?: number; 

	@Prop({ default: 1 })
	usageLimitPerUser?: number;

	@Prop({ default: 1000 })
	totalUsageLimit?: number;

	@Prop({ default: 0 })
	totalUsedCount?: number;

	@Prop({ type: Date, required: true })
	validFrom: Date;

	@Prop({ type: Date, required: true })
	validUntil: Date;

	@Prop({ default: true })
	isActive: boolean;

	@Prop([
		{
			user: { type: Types.ObjectId, ref: 'User' },
			usedCount: { type: Number, default: 0 },
		},
	])
	userUsage?: {
		user: Types.ObjectId;
		usedCount: number;
	}[];

	@Prop()
	description?: string;

	@Prop({ default: false })
	isDeleted: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
