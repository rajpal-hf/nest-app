import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive, IsString, IsEnum } from "class-validator";

export enum PaymentMethod {
	CreditCard = "CreditCard",
	DebitCard = "DebitCard",
	PayPal = "PayPal",
	Cash = "Cash",
}

export class PaymentDto {
	@ApiProperty({
		description: "Total amount to be paid",
		example: 49.99,
	})
	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	amount: number;

	@ApiProperty({
		description: "Payment method used",
		enum: PaymentMethod,
		example: PaymentMethod.CreditCard,
	})
	@IsEnum(PaymentMethod)
	@IsNotEmpty()
	paymentMethod: PaymentMethod;

	@ApiProperty({
		description: "User ID who made the payment",
		example: "64b8d8c4c9e6a3a0d8f0c123",
	})
	@IsNotEmpty()
	userId: string;

	@ApiProperty({
		description: "Order ID associated with this payment",
		example: "64b8d8c4c9e6a3a0d8f0c456",
	})
	@IsNotEmpty()
	orderId: string;
}
