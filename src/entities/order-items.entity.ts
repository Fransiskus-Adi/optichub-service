import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity('order_items')
export class OrderItemsEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    qty: number;

    @Column()
    @Expose()
    @ApiProperty()
    priceBeforeTax: number;

    @Column()
    @Expose()
    @ApiProperty()
    tax: number;

    @Column()
    @Expose()
    @ApiProperty()
    price: number;

    @Column()
    @Expose()
    @ApiProperty()
    totalPrice: number;

    @ManyToOne(() => OrderEntity, orderEntity => orderEntity.orderItem)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity;

    @OneToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity;
}