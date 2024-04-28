import { MigrationInterface, QueryRunner } from "typeorm";

export class orderItems1710706488037 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE order_items(
                id varchar(36) PRIMARY KEY NOT NULL,
                qty integer NOT NULL,
                totalPrice integer NOT NULL,
                priceBeforeTax integer NOT NULL,
                tax integer NOT NULL,
                price integer NOT NULL,
                orderId varchar(36),
                CONSTRAINT fk_order FOREIGN KEY (orderId) REFERENCES orders(id),
                productId varchar(36),
                CONSTRAINT fk_product FOREIGN KEY (productId) REFERENCES products(id),
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                deletedAt datetime(6) NULL,
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
            )`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
