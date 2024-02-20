import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

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

    @Column({ type: 'float' })
    @Expose()
    @ApiProperty()
    price: number;

    @Column({ type: 'float' })
    @Expose()
    @ApiProperty()
    quantity: number;

    // @OneToOne(
    //     () => PromotionDiscountEntity,
    //     (promotionDiscount) => promotionDiscount.id,
    //     { cascade: ['update'] },
    //   )
    //   @JoinColumn()
    //   @Expose()
    //   @ApiProperty()
    //   promotionDiscount: PromotionDiscountEntity;

}
