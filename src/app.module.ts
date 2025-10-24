import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		
		MongooseModule.forRoot(process.env.DB_URI!),
		AuthModule,
		BookmarkModule,
		UserModule,
	],
	
})

export class AppModule { }
