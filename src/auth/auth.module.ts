import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService, UsersService } from './auth.service'; // 👈 add UsersService import
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./schema/auth.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategy";

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
		JwtModule.register({})
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, JwtStrategy]
})
export class AuthModule { }
