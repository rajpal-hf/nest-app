import { Injectable, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Order } from 'src/order/schema/order.schema';
import { CheckoutDto } from './dto';




@Injectable()
export class CartService {
	constructor(
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
		@InjectModel(Order.name) private orderModel: Model<Order>,
	) { }

	async getCart(userId: string) {
		try {
				const cart = await this.cartModel
			.findOne({ user: userId })
			.populate('items.product')
			.lean();
		if (!cart) throw new NotFoundException('Cart not found');
		return cart;
		} catch (error) {
			console.error('Error in getCart:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal Server Error', 500);
		}
	
	}

	async addToCart(userId: string, productId: string, quantity: number) {
		try {
			const product = await this.productModel.findById(productId);
			if (!product) throw new HttpException('Product not found', 404);

			let cart = await this.cartModel.findOne({ user: userId });
			if (!cart) {
				cart = new this.cartModel({ user: userId, items: [] });
			}

			const itemIndex = cart.items.findIndex(
				(i) => i.product.toString() === productId,
			);

			if (itemIndex > -1) {
				cart.items[itemIndex].quantity += quantity;
			} else {
				cart.items.push({
					product: new Types.ObjectId(productId),
					quantity,
					priceAtTime: product.price
				});
			}
			await cart.save();
			return {
				message: 'Product added to cart successfully',
				cart,
			};
		} catch (error) {
			console.error('Error in addToCart:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal Server Error', 500);
		}
	}

	async removeFromCart(userId: string, productId: string) {

		try {
			const cart = await this.cartModel.findOne({ user: userId });
		if (!cart) throw new NotFoundException('Cart not found');

		cart.items = cart.items.filter(
			(i) => i.product.toString() !== productId.toString(),
		);
		await cart.save();
		return cart;
		} catch (error) {
			console.error('Error in removeFromCart:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal Server Error', 500);
		}
		
	}

	async checkout(userId: string, address: CheckoutDto["address"], paymentMethod = 'COD') {

		try {
			const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
		if (!cart || cart.items.length === 0)
			throw new BadRequestException('Cart is empty');

		const order = await this.orderModel.create({
			user: userId,
			items: cart.items.map((item) => ({
				product: item.product._id,
				quantity: item.quantity,
				price: item.priceAtTime
			})),
			totalAmount: cart.totalAmount,
			totalDiscount: cart.totalDiscount,
			finalAmount: cart.finalAmount,
			paymentMethod,
			paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
			shippingAddress: address,
			status: 'pending',
		});

		cart.isCheckedOut = true;
		await cart.save();

		return order;
		} catch (error) {
			console.error('Error in checkout:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal Server Error', 500);
		}
		
	}

	async clearCart(userId: string) {
		await this.cartModel.deleteOne({ user: userId });
		return { message: 'Cart cleared successfully' };
	}
}
