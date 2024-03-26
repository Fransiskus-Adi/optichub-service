import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderEntity } from "./order.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @Column()
    @ApiProperty()
    name: string;

    @Expose()
    @Column()
    @ApiProperty()
    email: string;

    @Expose()
    @Column({ type: 'date' })
    @ApiProperty()
    dob: Date;

    @Expose()
    @Column()
    @ApiProperty()
    phone_number: string;

    @Expose()
    @Column()
    @ApiProperty()
    password: string;

    @Expose()
    @Column()
    @ApiProperty()
    role: string;

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];
}