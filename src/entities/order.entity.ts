import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";
import { PrescriptionEntity } from "./prescription.entity";
import { OrderItemsEntity } from "./order-items.entity";

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @Expose()
    @ApiProperty()
    totalItem: number;

    @Expose()
    @Column({ default: false })
    @ApiProperty()
    isComplete: boolean;

    @Expose()
    @Column()
    @ApiProperty()
    withPrescription: boolean;

    @Column()
    @Expose()
    @ApiProperty()
    paymentMethod: string;

    @Column()
    @Expose()
    @ApiProperty()
    subTotal: number;

    @Column()
    @Expose()
    @ApiProperty()
    tax: number;

    @Column()
    @Expose()
    @ApiProperty()
    totalPrice: number;

    @Column({ type: 'date' })
    @Expose()
    @ApiProperty()
    transactionDate: Date;

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToOne(() => PrescriptionEntity)
    @JoinColumn({ name: 'prescriptionId' })
    prescription: PrescriptionEntity;

    @OneToMany(() => OrderItemsEntity, orderItem => orderItem.order, {
        cascade: ["insert"]
    })
    orderItem: OrderItemsEntity[];
}