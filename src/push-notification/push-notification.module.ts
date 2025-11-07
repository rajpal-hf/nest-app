import { Module } from '@nestjs/common';
import { PushNotificationController } from './push-notification.controller';
import { PushNotificationService } from './push-notification.service';
import { firebaseAdminProvider } from './firebase-admin.provider';

@Module({
  controllers: [PushNotificationController],
  providers: [PushNotificationService,firebaseAdminProvider]
})
export class PushNotificationModule {}
