import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>
    ) { }

    async findAll(): Promise<ProductEntity[]> {
        return this.productRepository.find();
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
            newProduct.price = createProductDto.price;
            newProduct.status = createProductDto.status;
            newProduct.quantity = createProductDto.quantity;
            newProduct.image_url = createProductDto.image_url;
            newProduct.category = new CategoryEntity();
            newProduct.category.id = createProductDto.categoryId;

            console.log(newProduct);
            return await this.productRepository.save(newProduct);
        } catch (error) {
            throw new Error;
        }
    }

    async getProductById(id: string): Promise<ProductEntity> {
        return await this.productRepository.findOne({ where: { id } })
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
        productData.image_url = updateProductDto.image_url;

        return await this.productRepository.save(productData);
    }
}