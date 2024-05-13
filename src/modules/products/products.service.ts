import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/request/createProductDto.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { UpdateProductDto } from './dto/request/updateProductDto.dto';
import { ProductDataDto } from './dto/response/productDataDto.dto';
import { plainToClass } from 'class-transformer';
import { ProductStatus } from 'src/enums/product-status.enum';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>
    ) { }

    // async uploadImage(imageFile: Express.Multer.File): Promise<string> {
    //     try {
    //         console.log('Received image file buffer:', imageFile.buffer);
    //         if (!imageFile) {
    //             throw new HttpException('No image was provided', HttpStatus.BAD_REQUEST);
    //         }

    //         // define the directory to store the image
    //         const uploadDirectory = path.join(__dirname, '..', 'uploads');

    //         // if the directory above doesnt exist, create the directory
    //         if (!fs.existsSync(uploadDirectory)) {
    //             fs.mkdirSync(uploadDirectory, { recursive: true });
    //         }

    //         // generate the file name to avoid name conflict
    //         const uniqueFileName = `${Date.now()}-${imageFile.originalname}`;

    //         // save the image to file directory
    //         const filePath = path.join(uploadDirectory, uniqueFileName);
    //         fs.writeFileSync(filePath, imageFile.buffer);

    //         // return the image path
    //         const fileUrl = `/uploads/${uniqueFileName}`;
    //         return fileUrl;
    //     } catch (error) {
    //         console.log(error);
    //         throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

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
            throw new Error("Product already exists!");
        }
        const price = parseInt(createProductDto.price, 10);
        const quantity = parseInt(createProductDto.quantity, 10);
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
            // return null
        } catch (error) {
            throw new Error("Failed to add new product");
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
            const url = "http://localhost:3000/images/"
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
        const url = "http://localhost:3000/images/"
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
            productData.priceBeforeTax = Math.ceil(price / 1.11);
            productData.tax = price - productData.priceBeforeTax;
            productData.price = price;
        }
        if (updateProductDto.quantity) {
            const quantity = parseInt(updateProductDto.quantity, 10);
            productData.quantity = quantity;
        }

        productData.name = updateProductDto.name;
        // if (updateProductDto.status) {
        //     productData.status = updateProductDto.status;
        // } else if (productData.quantity === 0) {
        //     productData.status = ProductStatus.INACTIVE;
        // }

        productData.status = updateProductDto.status;

        if (imageFile) {
            productData.imageUrl = imageFile;
        }
        productData.category = new CategoryEntity()
        productData.category.id = updateProductDto.categoryId;

        return await this.productRepository.save(productData);
    }
}