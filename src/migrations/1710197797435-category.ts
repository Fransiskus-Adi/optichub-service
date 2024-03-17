import { MigrationInterface, QueryRunner } from "typeorm";

export class category1707636406357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE category(
                id VARCHAR(36) PRIMARY KEY NOT NULL,
                name VARCHAR(30) NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );    
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE category
        `)
    }

}
