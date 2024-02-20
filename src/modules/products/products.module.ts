import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity
        ])
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }
