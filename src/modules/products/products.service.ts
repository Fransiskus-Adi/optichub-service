import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>
    ) { }

    async findAll(): Promise<any> {
        return this.productRepository.find();
    }
}
