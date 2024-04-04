import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('/')
    async findAll(): Promise<ProductEntity[]> {
        return this.productsService.findAll();
    }

    @Post('/add-product')
    async addProduct(@Body() createProductDto: CreateProductDto) {
        const newProduct = await this.productsService.addProduct(createProductDto);
        console.log(newProduct);
        return { message: 'New product was added!', data: newProduct }
    }

    @Get('/search')
    async getProductById(@Query('id') id?: string): Promise<ProductEntity> {
        return await this.productsService.getProductById(id);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<any> {
        return await this.productsService.deleteProduct(id);
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
        return await this.productsService.updateProduct(id, updateProductDto);
    }
}
