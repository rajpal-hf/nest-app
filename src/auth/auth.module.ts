import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, authSchema } from "./schema/auth.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{name : Auth.name , schema : authSchema} ] , "auth")
	],
  controllers: [AuthController],
  providers: [AuthService]
})

export class AuthModule {}