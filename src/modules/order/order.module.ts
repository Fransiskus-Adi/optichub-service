import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrescriptionEntity } from 'src/entities/prescription.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            PrescriptionEntity
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }