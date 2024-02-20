import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity('category')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    name: string;
}
