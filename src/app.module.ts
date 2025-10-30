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


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		
		MongooseModule.forRoot(process.env.DB_URI!),
		AuthModule,
		ProductModule,
		OrderModule,
		CartModule,
		CouponModule,
		SlotModule,
		BookingSlotModule,

	],
	
})

export class AppModule { }
