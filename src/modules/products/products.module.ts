import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity
        ]),
        MulterModule.register({
            storage: multerConfig.storage
        })
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }
