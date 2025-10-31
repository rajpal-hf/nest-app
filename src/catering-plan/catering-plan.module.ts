import { Module } from '@nestjs/common';
import { CateringPlanService } from './catering-plan.service';
import { CateringPlanController } from './catering-plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CateringPlan, CateringPlanSchema } from './schema/cateringPlan.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: CateringPlan.name,
				schema: CateringPlanSchema,
			},
		]),
		AuthModule
	],
  providers: [CateringPlanService],
  controllers: [CateringPlanController]
})
export class CateringPlanModule {}


