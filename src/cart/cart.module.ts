import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Cart.name, schema: CartSchema },
			{ name: Order.name, schema: OrderSchema }, 
			{ name: Product.name, schema: ProductSchema }, 
		]),
		AuthModule,
	],
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule { }
