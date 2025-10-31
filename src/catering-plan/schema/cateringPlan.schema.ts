import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Restaurant } from "src/restaurant/schema/restaurant.schema";

export enum PlanNames {
	Basic = 'Basic',
	Standard = 'Standard',
	Premium = 'Premium'
}

@Schema({ timestamps: true })
export class CateringPlan	 {
	@Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
	restaurant: Types.ObjectId;

	@Prop({ required: true, type: String, enum: Object.values(PlanNames) })
	name: string;

	@Prop({ required: true })
	price_per_person: number;

	@Prop()
	min_people?: number;

	@Prop()
	max_people?: number;

	@Prop()
	description?: string;

	@Prop([
		{
			food: { type: Types.ObjectId, ref: 'Food', required: true },
			quantity: { type: Number, default: 1 }
		},
	])
	menu_items: {
		food: Types.ObjectId;
		quantity: number;
	}[];

}

export type CateringPlanDocument = HydratedDocument<CateringPlan>;

export const CateringPlanSchema = SchemaFactory.createForClass(CateringPlan);


