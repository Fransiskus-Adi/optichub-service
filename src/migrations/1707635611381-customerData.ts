import { MigrationInterface, QueryRunner } from "typeorm";

export class customerData1707635611381 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE customerData (
                id varchar(36) PRIMARY KEY NOT NULL,
                name varchar(50) NOT NULL,
                email varchar(50) NOT NULL,
                dob date NOT NULL,
                phone_number varchar(20) NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );        
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE customerData
        `)
    }

}
