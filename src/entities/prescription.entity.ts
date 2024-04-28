import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderEntity } from "./order.entity";

@Entity('prescriptions')
export class PrescriptionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    right_sph: string;

    @Expose()
    @Column()
    @ApiProperty()
    right_cylinder: string;

    @Expose()
    @Column()
    @ApiProperty()
    right_axis: string;

    @Expose()
    @Column()
    @ApiProperty()
    right_add: string;

    @Expose()
    @Column()
    @ApiProperty()
    right_pd: string;

    @Expose()
    @Column()
    @ApiProperty()
    left_sph: string;

    @Expose()
    @Column()
    @ApiProperty()
    left_cylinder: string;

    @Expose()
    @Column()
    @ApiProperty()
    left_axis: string;

    @Expose()
    @Column()
    @ApiProperty()
    left_add: string;

    @Expose()
    @Column()
    @ApiProperty()
    left_pd: string;
}