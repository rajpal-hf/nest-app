import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { RoomStatus } from "src/constants";
import { User } from "src/auth/schema/auth.schema";

@Schema({ timestamps: true })
export class Room {
	@Prop()
	name: string; 
	@Prop({ required: true, enum: RoomStatus })
	roomStatus: RoomStatus; 

	@Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
	members: User[];
	
	@Prop({ type: Types.ObjectId, ref: 'User' })
	createdBy: User;
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
