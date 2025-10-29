import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { AddProductDto, ProductFilterDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
	) { }


	async createProduct(productData: Partial<Product>): Promise<Product> {
		const newProduct = new this.productModel(productData);
		return newProduct.save();
	}

	async filterProduct(filterData: ProductFilterDto) {
		try {
			const result: any = {};

		if (filterData.search) {
			result.$or = [
				{id : {$regex: filterData.search, $options: 'i' }},
				{ name: { $regex: filterData.search, $options: 'i' } },
				{ description: { $regex: filterData.search, $options: 'i' } },
			];
		}

		const products = await this.productModel.find(result).exec();
		return products;
	
		} catch (error) {
			console.error('Error filtering products:', error);
			throw error instanceof HttpException ? error : new HttpException('Internal server error in filtering the data', 500);
		}
		
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


	async bulkCreate(products: any[]) {
		if (!products || products.length === 0) {
			throw new Error('No products to insert');
		}
		return this.productModel.insertMany(products);
	}

}
