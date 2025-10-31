import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
	import { HydratedDocument } from "mongoose";

export enum UserRole {
	ADMIN = 'admin',
	CUSTOMER = 'customer',
	VENDOR = "vendor"
}
 export enum UserStatus { 
	ACTIVE = 'active',
	INACTIVE = 'inactive',
 }
export enum UserGender {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other',
}
@Schema({timestamps: true})
export class User {
	@Prop({ required: true, trim: true})
	name: String
	
	@Prop({required : true, trim: true}) 
	email: String
	
	@Prop()
	password: String
	
	@Prop({enum: UserGender})
	gender: UserGender

	@Prop({enum: UserStatus , default : UserStatus.ACTIVE})
	status: UserStatus

	@Prop()
	phone: String

	@Prop({
		type: String,
		enum: UserRole,
		default: UserRole.CUSTOMER
	})
	role: UserRole;

}	

export type UserDocument = HydratedDocument<User>

export const userSchema = SchemaFactory.createForClass(User)

