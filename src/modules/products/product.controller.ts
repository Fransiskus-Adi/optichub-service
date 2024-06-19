import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, HttpException, HttpStatus, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';
import { ProductDataDto } from './dto/response/productDataDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { ProductStockDto } from './dto/response/productStockDto.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('/')
    async getAllProduct(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('keyword') keyword?: string,
        @Query('categoryId') categoryId?: string,
        @Query('status') status?: string | ''
    ): Promise<{
        data: ProductDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {
        return this.productsService.getAllProduct(page, limit, keyword, categoryId, status);
    }

    @Post('/')
    @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
    async addProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() imageFile: Express.Multer.File
    ) {
        try {
            if (!imageFile) {
                throw new Error("Image file was missing")
            }
            const newProduct = await this.productsService.addProduct(createProductDto, imageFile.filename);
            console.log(imageFile)
            console.log(createProductDto)
            console.log(newProduct);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message || 'Internal server error', error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/stock')
    async getProductStock(): Promise<ProductStockDto[]> {
        return this.productsService.getProductStock();
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
    @UseInterceptors(FileInterceptor('imageUrl', multerConfig))
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() imageFile?: Express.Multer.File
    ): Promise<ProductEntity> {
        const imageUrl = imageFile ? imageFile.filename : '';
        return await this.productsService.updateProduct(id, updateProductDto, imageUrl);
    }
}
