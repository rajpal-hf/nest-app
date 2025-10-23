import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Auth {
	@Prop({ required: true, trim: true})
	name: String
	
	@Prop({required : true, trim: true}) 
	email: String
	
	@Prop()
	password : String
}

export type authDocument = HydratedDocument<Auth>

export const authSchema = SchemaFactory.createForClass(Auth)

