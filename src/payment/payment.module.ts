import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { AuthModule } from 'src/auth/auth.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { User, userSchema } from 'src/auth/schema/auth.schema';
import { StripeWebhookController } from './payment.webhook.controller';

@Module({
	imports: [AuthModule,
		MongooseModule.forFeature([
			{ name: Order.name, schema: OrderSchema },
			{ name: Payment.name, schema: PaymentSchema },
			{name: User.name, schema: userSchema},
			
		])
	],
  controllers: [PaymentController,StripeWebhookController],
  providers: [PaymentService]
})
export class PaymentModule {}
