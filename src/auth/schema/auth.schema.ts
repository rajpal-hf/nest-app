import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class User {
	@Prop({ required: true, trim: true})
	name: String
	
	@Prop({required : true, trim: true}) 
	email: String
	
	@Prop()
	password : String
}	

export type userDocument = HydratedDocument<User>

export const userSchema = SchemaFactory.createForClass(User)

