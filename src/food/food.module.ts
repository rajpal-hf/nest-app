import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './schema/food.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Food.name,
				schema :FoodSchema
			}
		]),
		AuthModule,
	],
  controllers: [FoodController],
  providers: [FoodService]
})
export class FoodModule {}
