import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';
import { ProductDataDto } from './dto/response/productDataDto.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>
    ) { }

    async getAllProduct(
        page: number = 1,
        limit: number = 10,
        keyword?: string,
        categoryId?: string,
        status?: boolean,
    ): Promise<{ data: ProductDataDto[], totalCount: number }> {
        let whereConditions: any = {}

        //validate if keyword was provided
        if (keyword) {
            whereConditions.name = Like(`%${keyword}%`);
        }

        //validate if category id was provided
        if (categoryId) {
            whereConditions.category = whereConditions.category || {};
            whereConditions.category.id = categoryId;
        }

        //validate if status was provided
        if (status) {
            whereConditions.status = status;
        }

        const [data, totalCount] = await this.productRepository.findAndCount({
            where: whereConditions,
            relations: ['category'],
            take: limit,
            skip: (page - 1) * limit
        })

        const transformedData = data.map(product => {
            const productDto = plainToClass(ProductDataDto, product);
            productDto.categoryId = product.category.id;
            return productDto;
        })

        return { data: transformedData, totalCount }
    }

    async addProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
        const validateProductExist = await this.productRepository.findOne({
            where: {
                name: createProductDto.name,
            }
        })
        if (validateProductExist) {
            throw new Error("Product already exists!");
        }
        try {
            const newProduct = new ProductEntity()
            newProduct.name = createProductDto.name;
            newProduct.priceBeforeTax = Math.ceil(createProductDto.price / 1.11);
            newProduct.tax = createProductDto.price - newProduct.priceBeforeTax;
            newProduct.price = createProductDto.price;
            newProduct.status = createProductDto.status;
            newProduct.quantity = createProductDto.quantity;
            newProduct.imageUrl = createProductDto.image_url;
            newProduct.category = new CategoryEntity();
            newProduct.category.id = createProductDto.categoryId;

            console.log(newProduct);
            return await this.productRepository.save(newProduct);
        } catch (error) {
            throw new Error;
        }
    }

    async getProductById(id: string): Promise<{ data: ProductDataDto }> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category']
        });
        if (!product) {
            throw new NotFoundException('Product Not Found!');
        }

        const productDataDto = new ProductDataDto();
        productDataDto.id = product.id;
        productDataDto.name = product.name;
        productDataDto.priceBeforeTax = product.priceBeforeTax;
        productDataDto.tax = product.tax;
        productDataDto.price = product.price;
        productDataDto.status = product.status;
        productDataDto.quantity = product.quantity;
        productDataDto.imageUrl = product.imageUrl;
        productDataDto.categoryId = product.category.id;

        return { data: productDataDto };
    }

    async deleteProduct(id: string): Promise<any> {
        try {
            return await this.productRepository.softDelete(id);
        } catch (error) {
            throw new NotFoundException('Id not found !');
        }
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
        const productData = await this.productRepository.findOne(id)
        if (!productData) {
            throw new NotFoundException('Product Not Found!')
        }
        productData.name = updateProductDto.name;
        productData.price = updateProductDto.price;
        productData.status = updateProductDto.status;
        productData.quantity = updateProductDto.quantity;
        productData.imageUrl = updateProductDto.imageUrl;
        productData.category = new CategoryEntity()
        productData.category.id = updateProductDto.categoryId;

        return await this.productRepository.save(productData);
    }
}