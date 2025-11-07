import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Otp {
	@Prop({ required: true })
	email: string;

	@Prop({ required: true, unique: true })
	otp: string;

	@Prop({
		type: Date,
		default: Date.now,
		expires: 300, 
	})
	createdAt: Date;
}

export type OtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);
