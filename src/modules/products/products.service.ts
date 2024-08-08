import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';
import { ProductDataDto } from './dto/response/productDataDto.dto';
import { plainToClass } from 'class-transformer';
import { ProductStockDto } from './dto/response/productStockDto.dto';



@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>,
    ) { }

    async addProduct(
        createProductDto: CreateProductDto,
        imageFile: string | null
    ): Promise<ProductEntity> {
        const validateProductExist = await this.productRepository.findOne({
            where: {
                name: createProductDto.name,
            }
        })
        if (validateProductExist) {
            throw new BadRequestException("Product already exists!");
        }
        const price = parseInt(createProductDto.price, 10);
        const quantity = parseInt(createProductDto.quantity, 10);

        if (isNaN(price) || price <= 0 || price > 100000000) {
            throw new BadRequestException("Invalid Price Value!, Minimum Value 0 & Maximum Value 99,999,999")
        }

        if (isNaN(quantity) || quantity <= 0 || quantity > 1000) {
            throw new BadRequestException("Invalid Quantity Value!, Minimum Value 0 & Maximum Value 999")
        }
        try {
            const newProduct = new ProductEntity()
            newProduct.name = createProductDto.name;
            newProduct.priceBeforeTax = Math.ceil(price / 1.11);
            newProduct.tax = price - newProduct.priceBeforeTax;
            newProduct.price = price;
            newProduct.status = createProductDto.status;
            newProduct.quantity = quantity;
            newProduct.category = new CategoryEntity();
            newProduct.category.id = createProductDto.categoryId;

            newProduct.imageUrl = imageFile;
            return await this.productRepository.save(newProduct);
        } catch (error) {
            throw new InternalServerErrorException("Failed to add new product");
        }
    }

    async getAllProduct(
        page: number = 1,
        limit: number = 10,
        keyword?: string,
        categoryId?: string,
        status?: string | '',
    ): Promise<{
        data: ProductDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {
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
        if (status !== undefined && status !== '') {
            whereConditions.status = status;
        }

        const [data, totalCount] = await this.productRepository.findAndCount({
            where: whereConditions,
            relations: ['category'],
            take: limit,
            skip: (page - 1) * limit
        })

        const totalPages = Math.ceil(totalCount / limit)
        const transformedData = data.map(product => {
            const productDto = plainToClass(ProductDataDto, product);
            const url = `${process.env.IMAGE_URL}`
            productDto.imageUrl = url + product.imageUrl
            productDto.categoryId = product.category.id;
            return productDto;
        })

        return {
            data: transformedData,
            metadata: {
                totalCount, currentPage: page, totalPages
            }
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
        const url = `${process.env.IMAGE_URL}`
        productDataDto.imageUrl = url + product.imageUrl;
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

    async updateProduct(
        id: string,
        updateProductDto: UpdateProductDto,
        imageFile?: string | null
    ): Promise<ProductEntity> {
        const productData = await this.productRepository.findOne(id)
        if (!productData) {
            throw new NotFoundException('Product Not Found!')
        }

        if (updateProductDto.price) {
            const price = parseInt(updateProductDto.price, 10);
            if (price !== productData.price) {
                if (isNaN(price) || price <= 0 || price > 100000000) {
                    throw new BadRequestException("Invalid Price Value!, Minimum Value 0 & Maximum Value 99,999,999")
                }
                productData.priceBeforeTax = Math.ceil(price / 1.11);
                productData.tax = price - productData.priceBeforeTax;
                productData.price = price;
            }
        }
        if (updateProductDto.quantity) {
            const quantity = parseInt(updateProductDto.quantity, 10);
            if (quantity !== productData.quantity) {
                if (isNaN(quantity) || quantity <= 0 || quantity > 1000) {
                    throw new BadRequestException("Invalid Quantity Value!, Minimum Value 0 & Maximum Value 999")
                }
                productData.quantity = quantity;
            }
        }

        const validateProductExist = await this.productRepository.findOne({
            where: {
                name: updateProductDto.name
            }
        })
        if (updateProductDto.name && updateProductDto.name !== productData.name) {
            if (validateProductExist) {
                throw new BadRequestException("Product already exists!");
            }
            productData.name = updateProductDto.name;
        }

        productData.status = updateProductDto.status;

        if (imageFile && imageFile !== productData.imageUrl) {
            productData.imageUrl = imageFile;
        }

        if (updateProductDto.categoryId) {
            productData.category = new CategoryEntity()
            if (updateProductDto.categoryId !== productData.category.id) {
                productData.category.id = updateProductDto.categoryId;
            }
        }

        return await this.productRepository.save(productData);
    }

    async getProductStock(): Promise<ProductStockDto[]> {
        const productData = await this.productRepository.find();
        const filteredData = productData
            //to filter product that has quantity <= 5
            .filter(product => product.quantity <= 5)
            //to sort ascending
            .sort((a, b) => a.quantity - b.quantity)
        return filteredData.map(product => ({
            name: product.name,
            quantity: product.quantity,
        }));
    }
}