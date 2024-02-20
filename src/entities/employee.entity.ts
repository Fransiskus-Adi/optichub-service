import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity('employee')
export class EmployeeEntity extends BaseEntity {
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
    @Column({
        type: 'datetime',
    }
    )
    @ApiProperty()
    dob: Date;

    @Expose()
    @Column()
    @ApiProperty()
    phone_number: string;
}
