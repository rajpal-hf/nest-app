import { Controller, Get, Param, Patch, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { OrderDTO, UpdateStatusDTO, CancelOrderDTO, RefundStatusDTO } from './dto/order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) { }

	@Get()

	@ApiOperation({ summary: 'Get all orders for a specific user' })
	@ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [OrderDTO] })
	getUserOrders(@Req() req: any) {
		return this.orderService.getUserOrders(req.user.id);
	}

	@Get('all')
	@ApiOperation({ summary: 'Get all orders' })
	@ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [OrderDTO] })
	getAllOrders() {
		return this.orderService.getAllOrders();
	}

	@Get(':orderId')
	@ApiOperation({ summary: 'Get a specific order by ID' })
	@ApiParam({ name: 'orderId', type: String })
	@ApiResponse({ status: 200, description: 'Order found', type: OrderDTO })
	@ApiResponse({ status: 404, description: 'Order not found' })
	getOrderById(@Param('orderId') orderId: string) {
		return this.orderService.getOrderById(orderId);
	}

	@Patch(':orderId/status')
	@ApiOperation({ summary: 'Update order status' })
	@ApiParam({ name: 'orderId', type: String })
	@ApiBody({ type: UpdateStatusDTO })
	@ApiResponse({ status: 200, description: 'Order status updated', type: OrderDTO })
	@ApiResponse({ status: 404, description: 'Order not found' })
	updateStatus(@Param('orderId') orderId: string, @Body() body: UpdateStatusDTO) {
		return this.orderService.updateStatus(orderId, body.status);
	}

	@Patch(':orderId/cancel')
	@ApiOperation({ summary: 'Cancel an order' })
	@ApiParam({ name: 'orderId', type: String })
	@ApiBody({ type: CancelOrderDTO })
	@ApiResponse({ status: 200, description: 'Order cancelled', type: OrderDTO })
	@ApiResponse({ status: 400, description: 'Cannot cancel delivered order' })
	@ApiResponse({ status: 404, description: 'Order not found' })
	cancelOrder(
		@Param('orderId') orderId: string,
		@Body() body: CancelOrderDTO,
	) {
		return this.orderService.cancelOrder(orderId, body.cancelledBy, body.reason);
	}

	@Patch(':orderId/refund')
	@ApiOperation({ summary: 'Process a refund for an order' })
	@ApiParam({ name: 'orderId', type: String })
	@ApiResponse({ status: 200, description: 'Refund processed successfully', type: RefundStatusDTO })
	@ApiResponse({ status: 404, description: 'Order not found' })
	processRefund(@Param('orderId') orderId: string) {
		return this.orderService.processRefund(orderId);
	}
}
