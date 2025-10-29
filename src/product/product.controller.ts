import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
	Body,
	Get,
	Param,
	Patch,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs';
import  csv from 'csv-parser';

import { extname } from 'path';
import { ProductService } from './product.service';
import { AddProductDto, ProductFilterDto, UpdateProductDto } from './dto/product.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/roleGuard/roles.guard';
import { Roles } from 'src/roleGuard/roles.decorator';
import { UserRole } from 'src/auth/schema/auth.schema';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@Post('upload')
	@ApiOperation({ summary: 'Create a new product (Admin only)' })
	@ApiConsumes('multipart/form-data')
	@ApiResponse({ status: 201, description: 'Product created successfully' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
	@ApiBody({
	description: 'Product upload form data',
	required: true,
	schema: {
		type: 'object',
		properties: {
			name: { type: 'string', example: 'Apple iPhone 15 Pro' },
			description: {
				type: 'string',
				example: 'Latest iPhone with A17 Pro chip and titanium frame',
			},
			price: { type: 'number', example: 1299.99 },
			strockQuantity: { type: 'number', example: 9 },
			currency: { type: 'string', example: 'USD' },
			file: {
				type: 'string',
				format: 'binary',
				description: 'Product image file',
			},
		},
	},
})
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/products',
				filename: (req, file, callback) => {
					const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
					callback(null, filename);	
				},
			}),
		}),
	)
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: AddProductDto,
	) {
		const { name, description, price, currency } = body;

		const newProduct = await this.productService.createProduct({
			name,
			description,
			price: Number(price),
			currency,
			stockQuantity: Number(body.stockQuantity),
			image: file?.filename,
		});

		return {
			message: 'Product created successfully',
			product: newProduct,
		};
	}

	@Get('all-products')
	@ApiOperation({ summary: 'Get a product by ID' })
	@ApiResponse({ status: 200, description: 'Product details' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	getProductById(@Param() id:ProductFilterDto) {
		return this.productService.filterProduct(id);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@Patch(':id')
	@ApiOperation({ summary: 'Update product details (Admin only)' })
	@ApiParam({ name: 'id', description: 'Product ID' })
	@ApiResponse({ status: 200, description: 'Product updated successfully' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	async updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDto) {
		return this.productService.updateProduct(id, updateData);
	}


	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@Delete(':id')
	@ApiOperation({ summary: 'Delete a product (Admin only)' })
	@ApiParam({ name: 'id', description: 'Product ID' })
	@ApiResponse({ status: 200, description: 'Product deleted successfully' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	async deleteProduct(@Param('id') id: string) {
		return this.productService.deleteProduct(id);
	}

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@Post('upload-csv')
@ApiOperation({ summary: 'Upload a CSV file of products (Admin only)' })
@ApiConsumes('multipart/form-data')
@ApiResponse({ status: 201, description: 'Products imported successfully' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
@ApiBody({
	description: 'Product upload form data',
	required: true,
	schema: {
		type: 'object',
		properties: {
			file: {
				type: 'string',
				format: 'binary',
				description: 'Product image file',
			},
		},
	},
})
@UseInterceptors(
	FileInterceptor('file', {
		storage: diskStorage({
			destination: './uploads/products',
			filename: (req, file, callback) => {
				const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
				const ext = extname(file.originalname);
				const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
				callback(null, filename);
			},
		}),
	}),
	)
	

async uploadCsvFile(@UploadedFile() file: Express.Multer.File) {
	if (!file) {
		throw new Error('CSV file is required');
	}

	const products: AddProductDto[] = [];
	
	const filePath = file.path;

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (data) => {
				products.push({
					name: data.name,
					description: data.description,
					price: data.price,
					currency: data.currency,
					stockQuantity: data.stockQuantity,
					image: data.image || null ,
				});
			})
			.on('end', async () => {
				try {
					const inserted = await this.productService.bulkCreate(products);
					resolve({
						message: 'CSV imported successfully',
						count: inserted.length,
					});
				} catch (error) {
					reject(error);
				}
			})
			.on('error', (err) => reject(err));
	});
}


}