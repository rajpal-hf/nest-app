import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
	) { }


	async createProduct(productData: Partial<Product>): Promise<Product> {
		const newProduct = new this.productModel(productData);
		return newProduct.save();
	}


	async findAll(): Promise<Product[]> {
		return this.productModel.find().exec();
	}

	async findById(id: string): Promise<Product> {
		const product = await this.productModel.findById(id).exec();
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	async updateProduct(id: string, updateData: UpdateProductDto): Promise<Product> {
		const updatedProduct = await this.productModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.exec();

		if (!updatedProduct) {
			throw new NotFoundException('Product not found');
		}
		return updatedProduct;
	}

	async deleteProduct(id: string): Promise<{ message: string }> {
		const result = await this.productModel.findByIdAndDelete(id).exec();
		if (!result) {
			throw new NotFoundException('Product not found');
		}
		return { message: 'Product deleted successfully' };
	}
}
