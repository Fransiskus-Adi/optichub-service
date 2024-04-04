import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategoryEntity } from "./category.entity";
import { OrderEntity } from "./order.entity";
import { OrderItemsEntity } from "./order-items.entity";

@Entity('products')
export class ProductEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    name: string;

    @Column()
    @Expose()
    @ApiProperty()
    price: number;

    @Column({ default: true })
    @Expose()
    @ApiProperty()
    status: boolean;

    @Column()
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

    // @OneToOne(() => OrderItemsEntity, orderItem => orderItem.product)
    // @JoinColumn()
    // orderItem: OrderEntity;
}
