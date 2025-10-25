import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum UserRole {
	ADMIN = 'admin',
	CUSTOMER = 'customer',
}
@Schema()
export class User {
	@Prop({ required: true, trim: true})
	name: String
	
	@Prop({required : true, trim: true}) 
	email: String
	
	@Prop()
	password: String
	
	@Prop({
		type: String,
		enum: UserRole,
		default: UserRole.CUSTOMER
	})
	role: UserRole;

}	

export type UserDocument = HydratedDocument<User>

export const userSchema = SchemaFactory.createForClass(User)

