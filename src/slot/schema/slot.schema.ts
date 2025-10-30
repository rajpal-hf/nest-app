import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';


@Schema({ timestamps: true })
export class Slot {
	@Prop({ required: true })
	date: string; 

	@Prop({ required: true })
	startTime: string;

	@Prop({ required: true })
	endTime: string; 

	@Prop({ default: 'available', enum: ['available', 'booked'] })
	status: string;

	@Prop({ type: String })
	bookedBy?: string; 
}

export type SlotDocument = HydratedDocument<Slot>;

export const SlotSchema = SchemaFactory.createForClass(Slot);
