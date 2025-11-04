import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { Room, RoomSchema } from './schema/room.schema';
import { User, userSchema } from 'src/auth/schema/auth.schema';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({

	imports: [
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema }, 
			{ name: Room.name, schema: RoomSchema },
			{ name: User.name, schema: userSchema}
		]),
		AuthModule,
	],
	providers : [ChatGateway, ChatService],
	controllers: [ChatController]
})
export class ChatModule {
	
}
