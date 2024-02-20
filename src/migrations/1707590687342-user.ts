import { MigrationInterface, QueryRunner } from "typeorm";

export class user1707590687342 implements MigrationInterface {
    name = "user1707590687342";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE user (
                id varchar(36) PRIMARY KEY NOT NULL,
                name varchar(50) NOT NULL,
                email varchar(50) NOT NULL,
                password varchar(30) NOT NULL,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE user
        `);
    }

}
