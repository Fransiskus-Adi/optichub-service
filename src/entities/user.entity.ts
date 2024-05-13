import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderEntity } from "./order.entity";
import { UserStatus } from "src/enums/user-status.enum";

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

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    @Expose()
    @ApiProperty()
    status: UserStatus;

    @Expose()
    @Column({ type: 'date' })
    @ApiProperty()
    dob: Date;

    @Expose()
    @Column()
    @ApiProperty()
    phone_number: string;

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