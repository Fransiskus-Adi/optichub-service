import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrescriptionEntity } from 'src/entities/prescription.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { OrderItemsEntity } from 'src/entities/order-items.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderItemsEntity,
            PrescriptionEntity,
            ProductEntity
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }