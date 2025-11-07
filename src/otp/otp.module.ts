import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/auth/schema/auth.schema';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: userSchema },
			{ name : Otp.name, schema : OtpSchema}
		]),
	],
  controllers: [OtpController],
  providers: [OtpService]
})
export class OtpModule {}
