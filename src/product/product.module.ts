import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		AuthModule, 

		MulterModule.register({
			dest: './uploads'
		})
	],

	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule { }
