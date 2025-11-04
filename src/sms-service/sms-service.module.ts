import { Module } from '@nestjs/common';
import { SmsController } from './sms-service.controller';
import { SmsService } from './sms-service.service';

@Module({
  controllers: [SmsController],
	providers: [SmsService]
})
export class SmsServiceModule {}
