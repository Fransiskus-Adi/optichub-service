import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';
import { ProductDataDto } from './dto/response/productDataDto.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('/')
    async getAllProduct(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('keyword') keyword?: string,
        @Query('categoryId') categoryId?: string,
        @Query('status') status?: boolean
    ): Promise<{
        data: ProductDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {
        return this.productsService.getAllProduct(page, limit, keyword, categoryId, status);
    }

    @Post('/')
    async addProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
        const newProduct = await this.productsService.addProduct(createProductDto, file);
        console.log(newProduct);
        return { message: 'New product was added!', data: newProduct }
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<{ data: ProductDataDto }> {
        const productData = await this.productsService.getProductById(id);
        return productData;
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
