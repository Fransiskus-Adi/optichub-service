import { MigrationInterface, QueryRunner } from "typeorm";

export class orders1710701836633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE orders(
                id varchar(36) PRIMARY KEY NOT NULL,
                totalItem integer NOT NULL,
                paymentMethod varchar(255) NOT NULL,
                subTotal integer NOT NULL,
                tax integer NOT NULL,
                totalPrice integer NOT NULL,
                isComplete boolean NOT NULL,
                withPrescription boolean NOT NULL,
                transactionDate datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                userId varchar(36),
                CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id),
                prescriptionId varchar(36),
                CONSTRAINT fk_prescriptions FOREIGN KEY (prescriptionId) REFERENCES prescriptions(id),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            );`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE orders`
        )
    }

}
