import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderService {
	constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }


	async getUserOrders(userId: string) {
		return this.orderModel.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });
	}


	async getAllOrders() {
		return this.orderModel.find().populate('user').populate('items.product');
	}


	async getOrderById(orderId: string) {
		const order = await this.orderModel.findById(orderId).populate('items.product');
		if (!order) throw new NotFoundException('Order not found');
		return order;
	}

	async updateStatus(orderId: string, status: string) {
		const order = await this.orderModel.findById(orderId);
		if (!order) throw new NotFoundException('Order not found');
		order.status = status;

		if (status === 'delivered') order.deliveredAt = new Date();
		await order.save();
		return order;
	}

	/** Cancel order (user or admin) */
	async cancelOrder(orderId: string, cancelledBy: 'user' | 'admin', reason?: string) {
		const order = await this.orderModel.findById(orderId);
		if (!order) throw new NotFoundException('Order not found');

		if (order.status === 'delivered') {
			throw new BadRequestException('Cannot cancel delivered order');
		}

		order.status = 'cancelled';
		order.cancelledBy = cancelledBy;
		order.cancelReason = reason || 'Not specified';
		order.cancelledAt = new Date();
		order.refundStatus = 'initiated';
		await order.save();

		return order;
	}

	/** Process refund */
	async processRefund(orderId: string) {
		const order = await this.orderModel.findById(orderId);
		if (!order) throw new NotFoundException('Order not found');

		if (order.refundStatus !== 'initiated')
			throw new BadRequestException('Refund not initiated or already completed');

		order.refundStatus = 'completed';
		order.paymentStatus = 'refunded';
		await order.save();
		return order;
	}
}
