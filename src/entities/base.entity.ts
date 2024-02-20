import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    @Expose()
    id: string;

    @CreateDateColumn({ name: 'createdAt' })
    @ApiProperty({ readOnly: true })
    @Expose()
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updatedAt',
        type: 'datetime'
    })
    @ApiProperty({ readOnly: true })
    @Expose()
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deletedAt',
        type: 'datetime'
    })
    @ApiProperty({ readOnly: true })
    @Expose()
    deletedAt: Date;
}