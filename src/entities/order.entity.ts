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
    customer_name: string;

    @Column()
    @Expose()
    @ApiProperty()
    customer_phone: string;

    @Column()
    @Expose()
    @ApiProperty()
    customer_email: string;

    @Column()
    @Expose()
    @ApiProperty()
    quantity: number;

    @Expose()
    @Column()
    @ApiProperty()
    isComplete: boolean;

    @Column()
    @Expose()
    @ApiProperty()
    payment_method: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Expose()
    @ApiProperty()
    total_price: number;

    @Column()
    @Expose()
    @ApiProperty()
    status: boolean;

    @Column({ type: 'date' })
    @Expose()
    @ApiProperty()
    transaction_date: Date;

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToOne(() => PrescriptionEntity, prescription => prescription.order)
    @JoinColumn({ name: 'prescriptionId' })
    prescription: PrescriptionEntity;

    @OneToMany(() => OrderItemsEntity, orderItem => orderItem.order)
    orderItem: OrderItemsEntity;
}