import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema },
			{ name: Cart.name, schema:CartSchema}
		]),												
	],
  controllers: [CouponController],
  providers: [CouponService]
})
export class CouponModule {}
