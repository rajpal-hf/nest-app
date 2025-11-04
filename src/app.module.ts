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
import { CateringPlanModule } from './catering-plan/catering-plan.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { SmsServiceModule } from './sms-service/sms-service.module';
import { PushModule } from './push/push.module';



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
		CateringPlanModule,
		// PaymentModule,
		ChatModule,
		MailModule,
		SmsServiceModule,
		// PushModule,

	],
	
})

export class AppModule { }
