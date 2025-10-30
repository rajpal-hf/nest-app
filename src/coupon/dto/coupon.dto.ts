import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class CreateCouponDto {
	@ApiProperty({ example: 'WELCOME10', description: 'Unique coupon code' })
	@IsString()
	code: string;

	@ApiProperty({
		example: 'percentage',
		enum: ['percentage', 'fixed'],
		description: 'Discount type',
	})
	@IsEnum(['percentage', 'fixed'])
	discountType: 'percentage' | 'fixed';

	@ApiProperty({ example: 10, description: 'Discount value (percent or amount)' })
	@IsPositive()
	discountValue: number;

	@ApiProperty({ example: 500, required: false, description: 'Maximum discount amount (for percentage type)' })
	@IsOptional()
	@IsNumber()
	maxDiscountAmount?: number;

	@ApiProperty({ example: 1000, required: false, description: 'Minimum order value required' })
	@IsOptional()
	@IsNumber()
	minOrderAmount?: number;

	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	usageLimitPerUser?: number;

	@ApiProperty({ example: 1000, required: false })
	@IsOptional()
	@IsNumber()
	totalUsageLimit?: number;

	@ApiProperty({ example: '2025-11-01T00:00:00Z' })
	@IsDateString()
	validFrom: Date;

	@ApiProperty({ example: '2025-12-01T00:00:00Z' })
	@IsDateString()
	validUntil: Date;

	@ApiProperty({ example: true, required: false })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty({ example: 'Flat 10% off for new users', required: false })
	@IsOptional()
	@IsString()
	description?: string;
}

export class UpdateCouponDto {
	@ApiProperty({ example: true, required: false })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty({ example: 'Black Friday 25% off', required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ example: '2025-12-31T00:00:00Z', required: false })
	@IsOptional()
	@IsDateString()
	validUntil?: Date;
}

export class ApplyCouponDto {
	@ApiProperty({ example: 'NEWYEAR25', description: 'Coupon code to apply' })
	@IsString()
	code: string;
}
