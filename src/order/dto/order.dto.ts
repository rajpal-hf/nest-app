import { ApiProperty } from '@nestjs/swagger';

class ProductDTO {
	@ApiProperty()
	productId: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	price: number;
}

class OrderItemDTO {
	@ApiProperty()
	product: ProductDTO;

	@ApiProperty()
	quantity: number;
}

export class OrderDTO {
	@ApiProperty()
	id: string;

	@ApiProperty()
	user: string;

	@ApiProperty({ type: [OrderItemDTO] })
	items: OrderItemDTO[];

	@ApiProperty()
	status: string;

	@ApiProperty()
	createdAt: Date;
}


export class UpdateStatusDTO {
	@ApiProperty({ enum: ['pending', 'processing', 'delivered', 'cancelled'] })
	status: string;
}


export class CancelOrderDTO {
	@ApiProperty({ enum: ['user', 'admin'] })
	cancelledBy: 'user' | 'admin';

	@ApiProperty({ required: false })
	reason?: string;
}


export class RefundStatusDTO {
	@ApiProperty()
	id: string;

	@ApiProperty()
	refundStatus: string;

	@ApiProperty()
	paymentStatus: string;
}