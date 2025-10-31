import {
	Controller,
	Post,
	Get,
	Param,
	Body,
	Delete,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto, ApplyCouponDto } from './dto/coupon.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { UserRole } from 'src/auth/schema/auth.schema';

@ApiTags('Coupons')
@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)												
	@Roles(UserRole.ADMIN)
@Controller('coupons')
export class CouponController {
	constructor(private readonly couponService: CouponService) { }

	
	@Post()
	@ApiOperation({ summary: 'Create a new coupon (Admin)' })
	createCoupon(@Body() dto: CreateCouponDto) {
		return this.couponService.createCoupon(dto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all coupons (Admin)' })
	getAllCoupons() {
		return this.couponService.getAllCoupons();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get coupon by ID (Admin)' })
	getCouponById(@Param('id') id: string) {
		return this.couponService.getCouponById(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update coupon (Admin)' })
	updateCoupon(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
		return this.couponService.updateCoupon(id, dto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Soft delete coupon (Admin)' })
	deleteCoupon(@Param('id') id: string) {
		return this.couponService.deleteCoupon(id);
	}

	// 🔹 User routes
	@Post('apply')
	@ApiOperation({ summary: 'Apply coupon to user cart' })
	applyCoupon(@Req() req, @Body() dto: ApplyCouponDto) {
		return this.couponService.applyCoupon(req.user.id, dto);
	}

	@Get('validate/:code')
	@ApiOperation({ summary: 'Validate coupon code (check if active)' })
	validateCoupon(@Param('code') code: string) {
		return this.couponService.validateCoupon(code);
	}
}
