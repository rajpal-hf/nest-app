import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


	@Schema({ timestamps: true })
	export class Message {
	@Prop({ required: true })
	content: string;

	@Prop({ required: true, type: Types.ObjectId, ref: "User" })
	sender: string;

	@Prop({ type: Types.ObjectId, ref: "Room", required: true })
	room: string;

	@Prop()
	status: string;

	@Prop()
	isBroadcast: boolean;
	}

	
export type MessageDocument = HydratedDocument<Message>

export const MessageSchema = SchemaFactory.createForClass(Message)