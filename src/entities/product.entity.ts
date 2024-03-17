import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategoryEntity } from "./category.entity";
import { OrderEntity } from "./order.entity";
import { OrderItemsEntity } from "./order-items.entity";

@Entity('product')
export class ProductEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Expose()
    @ApiProperty()
    price: number;

    @Column({ type: 'float' })
    @Expose()
    @ApiProperty()
    quantity: number;

    @Column()
    @Expose()
    @ApiProperty()
    image_url: string;

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    @ApiProperty()
    category: CategoryEntity;

    @ManyToOne(() => OrderEntity, order => order.productsId)
    order: OrderEntity;

    @OneToOne(() => OrderItemsEntity, orderItem => orderItem.productId)
    @JoinColumn()
    orderItem: OrderEntity;
}
