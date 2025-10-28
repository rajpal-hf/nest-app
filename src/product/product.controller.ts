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
import { extname } from 'path';
import { ProductService } from './product.service';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';
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
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/images',
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
		const { name, description, price, currency, inStock } = body;
		const newProduct = await this.productService.createProduct({
			name,
			description,
			price: Number(price),
			currency,
			inStock,
			image: file?.filename,
		});

		return {
			message: 'Product created successfully',
			product: newProduct,
		};
	}

	@Get()
	@ApiOperation({ summary: 'Get all products' })
	@ApiResponse({ status: 200, description: 'List of all products' })
	getAllProducts() {
		return this.productService.findAll();
	}


	@Get(':id')
	@ApiOperation({ summary: 'Get a product by ID' })
	@ApiParam({ name: 'id', description: 'Product ID' })
	@ApiResponse({ status: 200, description: 'Product details' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	getProductById(@Param('id') id: string) {
		return this.productService.findById(id);
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
}
