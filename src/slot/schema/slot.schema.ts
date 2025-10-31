import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Slot {
	@Prop({ required: true })
	date: Date; 

	@Prop({ required: true })
	startTime: Date;

	@Prop({ required: true })
	endTime: Date; 

	@Prop({ default: 'available', enum: ['available', 'booked'] })
	status: string;

	@Prop({ type: Types.ObjectId, ref: 'User', default: null })
	bookedBy: Types.ObjectId; 
}

export type SlotDocument = HydratedDocument<Slot>;

export const SlotSchema = SchemaFactory.createForClass(Slot);
