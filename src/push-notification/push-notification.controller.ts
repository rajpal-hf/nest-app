import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationDTO } from './dto';
import { PushNotificationService } from './push-notification.service';

@Controller('push-notification')
export class PushNotificationController {

	constructor (private pushService :PushNotificationService){}
	@Post()
	sendNotification(@Body() pushNotification: PushNotificationDTO) {
		console.log( "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" , pushNotification)
		return this.pushService.send(pushNotification)
	}
}
