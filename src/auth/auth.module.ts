import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./schema/auth.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategy";
import { AuthGuard } from "./guard/auth.guard"; // 👈 Make sure this is your custom AuthGuard
import { RolesGuard } from "src/roleGuard/roles.guard";
import { Otp, OtpSchema } from "src/otp/schema/otp.schema";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forFeature([{ name: User.name, schema: userSchema },{name : Otp.name ,schema : OtpSchema}]),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'supersecretkey',
			signOptions: { expiresIn: '1d' },
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		AuthGuard,   
		RolesGuard,  
	],
	exports: [
		JwtModule,
		AuthGuard,   
		RolesGuard,  
	],
})
export class AuthModule { }
	