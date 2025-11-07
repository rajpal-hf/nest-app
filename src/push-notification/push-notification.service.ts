import { Injectable, Logger } from '@nestjs/common';
import { PushNotificationDTO } from './dto';
import * as firebase from 'firebase-admin';

@Injectable()
export class PushNotificationService {
	private readonly logger = new Logger(PushNotificationService.name);

	async send(noti: PushNotificationDTO) {
		try {
			const { title, body, deviceId } = noti;

			console.log(title, "<>", body, "<>", deviceId, "<>",)

			if (!deviceId) {
				throw new Error('Missing deviceId for push notification');
			}

			const message = {
				notification: {
					title,
					body,
				},
				token: deviceId,
				android: {
					priority: 'high' as const,
					notification: {
						sound: 'default',
					},
				},
				apns: {
					payload: {
						aps: {
							sound: 'default',
						},
					},
				},
			};

			const response = await firebase.messaging().send(message);

			this.logger.log(`Notification sent successfully: ${response}`);
			return { success: true, messageId: response };
		} catch (error) {
			this.logger.error('Error sending push notification', error.stack || error);
			throw new Error(`Failed to send notification: ${error.message}`);
		}
	}
}
