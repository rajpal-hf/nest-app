import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GetCartDto, AddToCartDto, CheckoutDto, CartDto } from './dto/cart.dto';

@ApiTags('Cart') // Add this decorator to group related endpoints in Swagger
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Get Cart by User ID', type: CartDto })
    getCart(@Req() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    // Add product to cart
    @Post('add/:productId')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Add Product to Cart', type: CartDto })
    addToCart(
        @Req() req: any, 
        @Param('productId') productId: string, 
        @Body() addToCartDto: AddToCartDto
    ) {
        return this.cartService.addToCart(req.user.id, productId, addToCartDto.quantity);
    }

    // Remove product from cart
    @Delete('remove/:productId')
    @ApiResponse({ status: 200, description: 'Remove Product from Cart', type: CartDto })
    removeFromCart(@Req() req: any, @Param('productId') productId: string) {
        return this.cartService.removeFromCart(req.user.id, productId);
    }

    // Checkout cart
    @Post('checkout')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Checkout Cart', type: CheckoutDto })
		checkout(@Req() req: any, @Body() body: CheckoutDto) {
			console.log('Checkout body:', body);
        return this.cartService.checkout(req.user.id, body.address, body.paymentMethod);
    }

    // Clear the cart
    @Delete('clear')
    @ApiResponse({ status: 200, description: 'Clear Cart' })
    clearCart(@Req() req: any) {
        return this.cartService.clearCart(req.user.id);
    }
}
