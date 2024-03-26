import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "./product.entity";
import { isArray } from "class-validator";

@Entity('category')
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    name: string;

    // @OneToMany(() => ProductEntity, product => product.category)
    // @ApiProperty({ isArray: true })
    // products: ProductEntity[];
}
