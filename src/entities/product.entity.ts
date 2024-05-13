import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CategoryEntity } from "./category.entity";
import { OrderEntity } from "./order.entity";
import { OrderItemsEntity } from "./order-items.entity";
import { ProductStatus } from "src/enums/product-status.enum";

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
    priceBeforeTax: number;

    @Column()
    @Expose()
    @ApiProperty()
    tax: number;

    @Column()
    @Expose()
    @ApiProperty()
    price: number;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
    @Expose()
    @ApiProperty()
    status: ProductStatus;

    @Column()
    @Expose()
    @ApiProperty()
    quantity: number;

    @Column()
    @Expose()
    @ApiProperty()
    imageUrl: string;

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    @ApiProperty()
    category: CategoryEntity;
}
