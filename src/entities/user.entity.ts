import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('user')
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
    @Column()
    @ApiProperty()
    password: string;
}
