import {
	Injectable,
	BadRequestException,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coupon, CouponDocument } from './schema/coupon.schema';
import { CreateCouponDto, UpdateCouponDto, ApplyCouponDto } from './dto/coupon.dto';
import { Cart, CartDocument } from 'src/cart/schema/cart.schema';

@Injectable()
export class CouponService {
	constructor(
		@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
	) { }

	async createCoupon(dto: CreateCouponDto) {
		const exists = await this.couponModel.findOne({ code: dto.code.toUpperCase() });
		if (exists) throw new BadRequestException('Coupon code already exists');

		const coupon = new this.couponModel({
			...dto,
			code: dto.code.toUpperCase(),
		});

		return coupon.save();
	}

	/** Admin: Get all coupons */
	async getAllCoupons() {
		return this.couponModel.find({ isDeleted: false }).sort({ createdAt: -1 });
	}

	/** Admin: Get single coupon by ID */
	async getCouponById(id: string) {
		const coupon = await this.couponModel.findById(id);
		if (!coupon) throw new NotFoundException('Coupon not found');
		return coupon;
	}

	/** Admin: Update coupon (validUntil, description, isActive) */
	async updateCoupon(id: string, dto: UpdateCouponDto) {
		const coupon = await this.couponModel.findById(id);
		if (!coupon) throw new NotFoundException('Coupon not found');

		Object.assign(coupon, dto);
		return coupon.save();
	}

	/** Admin: Soft delete coupon */
	async deleteCoupon(id: string) {
		const coupon = await this.couponModel.findById(id);
		if (!coupon) throw new NotFoundException('Coupon not found');
		coupon.isDeleted = true;
		coupon.isActive = false;
		return coupon.save();
	}

	/** User: Apply coupon to cart */
	async applyCoupon(userId: string, dto: ApplyCouponDto) {
		const code = dto.code.toUpperCase();
		const coupon = await this.couponModel.findOne({ code, isDeleted: false });
		if (!coupon) throw new NotFoundException('Invalid coupon code');

		// Validate coupon active status & dates
		const now = new Date();
		if (!coupon.isActive || now < coupon.validFrom || now > coupon.validUntil) {
			throw new ForbiddenException('Coupon is not active or expired');
		}

		// Get user's cart
		const cart = await this.cartModel.findOne({ user: userId });
		if (!cart || cart.items.length === 0)
			throw new BadRequestException('Cart is empty');

		if (cart.finalAmount < (coupon.minOrderAmount || 0)) {
			throw new BadRequestException(
				`Minimum order amount ₹${coupon.minOrderAmount} required to apply this coupon`,
			);
		}

		// Check usage limits
		const userUsage = coupon.userUsage?.find(
			(u) => u.user.toString() === userId.toString(),
		);
		if (userUsage && userUsage.usedCount >= (coupon.usageLimitPerUser || 1)) {
			throw new BadRequestException('You have already used this coupon');
		}

		if (coupon.totalUsedCount! >= coupon.totalUsageLimit!) {
			throw new BadRequestException('Coupon usage limit exceeded');
		}

		// Calculate discount
		let discount = 0;
		if (coupon.discountType === 'percentage') {
			discount = (cart.totalAmount * coupon.discountValue) / 100;
			if (coupon.maxDiscountAmount)
				discount = Math.min(discount, coupon.maxDiscountAmount);
		} else {
			discount = coupon.discountValue;
		}

		// Apply coupon to cart
		cart.couponCode = coupon.code;
		cart.couponDiscount = discount;
		cart.finalAmount = cart.totalAmount - discount;
		await cart.save();

		// Update coupon usage tracking
		coupon.totalUsedCount! += 1;
		if (userUsage) {
			userUsage.usedCount += 1;
		} else {
			coupon.userUsage!.push({
				user: new Types.ObjectId(userId),
				usedCount: 1,
			});
		}
		await coupon.save();

		return {
			message: 'Coupon applied successfully',
			cartSummary: {
				totalAmount: cart.totalAmount,
				discount,
				finalAmount: cart.finalAmount,
				coupon: coupon.code,
			},
		};
	}

												
	async validateCoupon(code: string) {
		const coupon = await this.couponModel.findOne({ code: code.toUpperCase(), isDeleted: false });
		if (!coupon) throw new NotFoundException('Coupon not found');

		const now = new Date();
		const valid =
			coupon.isActive && now >= coupon.validFrom && now <= coupon.validUntil;

		return {
			valid,
			coupon,
			message: valid ? 'Coupon is valid' : 'Coupon is inactive or expired',
		};
	}
}
