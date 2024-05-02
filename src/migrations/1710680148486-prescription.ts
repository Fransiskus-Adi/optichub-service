import { MigrationInterface, QueryRunner } from "typeorm";

export class prescription1710679712363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE prescriptions (
                id varchar(36) PRIMARY KEY NOT NULL,
                customerName varchar(255) NOT NULL,
                customerPhone varchar(18) NULL,
                customerEmail varchar(255) NULL,
                right_sph varchar(10),
                right_cylinder varchar(10),
                right_axis varchar(10),
                right_add varchar(10),
                right_pd varchar(10),
                left_sph varchar(10),
                left_cylinder varchar(10),
                left_axis varchar(10),
                left_add varchar(10),
                left_pd varchar(10),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            )`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE prescriptions
        `);
    }

}
