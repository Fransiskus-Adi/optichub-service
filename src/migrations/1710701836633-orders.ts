import { MigrationInterface, QueryRunner } from "typeorm";

export class orders1710701836633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE orders(
                id varchar(36) PRIMARY KEY NOT NULL,
                customer_name varchar(255) NOT NULL,
                customer_phone varchar(18),
                customer_email varchar(255),
                quantity integer NOT NULL,
                total_price decimal(10,2) NOT NULL,
                status boolean NOT NULL,
                transaction_date datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                userId varchar(36),
                CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id),
                productId varchar(36),
                CONSTRAINT fk_products FOREIGN KEY (productId) REFERENCES products(id),
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
