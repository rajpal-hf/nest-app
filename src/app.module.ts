import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { SlotModule } from './slot/slot.module';
import { BookingSlotModule } from './booking-slot/booking-slot.module';
import { ScheduleModule } from "@nestjs/schedule";
import { RestaurantModule } from './restaurant/restaurant.module';
import { CategoryModule } from './category/category.module';
import { FoodModule } from './food/food.module';
import { CateringPlanModule } from './catering-plan/catering-plan.module';
import { PaymentModule } from './payment/payment.module';


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		
		MongooseModule.forRoot(process.env.DB_URI!),
		AuthModule,
		ProductModule,
		OrderModule,
		CartModule,
		CouponModule,
		SlotModule,
		BookingSlotModule,
		RestaurantModule,
		CategoryModule,
		FoodModule,
		CateringPlanModule,
		PaymentModule,

	],
	
})

export class AppModule { }
