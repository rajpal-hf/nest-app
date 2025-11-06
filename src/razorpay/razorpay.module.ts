import { Module } from '@nestjs/common';
import { RazorpayController } from './razorpay.controller';
import { RazorpayService } from './razorpay.service';
import { RazorpayWebhookController } from './razorpay.webhook.controller';

@Module({
  controllers: [RazorpayController,RazorpayWebhookController],
  providers: [RazorpayService]
})
export class RazorpayModule {}
