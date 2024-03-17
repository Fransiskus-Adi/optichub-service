import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity('order-items')
export class OrderItemsEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Expose()
    @ApiProperty()
    sub_total: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Expose()
    @ApiProperty()
    total_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Expose()
    @ApiProperty()
    tax: number;

    @ManyToOne(() => OrderEntity, orderEntity => orderEntity.orderItem)
    @JoinColumn({ name: 'orderId' })
    orderId: OrderEntity;

    @OneToOne(() => ProductEntity, product => product.orderItem)
    @JoinColumn({ name: 'productId' })
    productId: ProductEntity;
}