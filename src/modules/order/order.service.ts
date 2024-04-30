import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/order.entity";
import { Like, Raw, Repository } from "typeorm";
import { AddTransactionDto } from "./dto/request/addTransactionDto.dto";
import { PrescriptionEntity } from "src/entities/prescription.entity";
import { OrderItemsEntity } from "src/entities/order-items.entity";
import { ProductEntity } from "src/entities/product.entity";
import { UserEntity } from "src/entities/user.entity";

import { OrderDataDto, PrescriptionData, ProductMeta } from "./dto/response/orderDataDto.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        public readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(PrescriptionEntity)
        public readonly prescriptionRepository: Repository<PrescriptionEntity>,
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>
    ) { }

    async getAllTransaction(
        page: number = 1,
        limit: number = 10,
        userName?: string,
        customerName?: string,
    ): Promise<{
        data: OrderDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {

        let whereConditions: any = {};

        if (userName) {
            whereConditions.user = whereConditions.user || {};
            whereConditions.user.name = Like(`%${userName}%`)
        }

        if (customerName) {
            whereConditions.customerName = Like(`%${customerName}%`)
        }

        // tambahin filter status order and filter start date & end date

        const [allTransaction, totalCount] = await this.orderRepository.findAndCount({
            where: whereConditions,
            relations: ['prescription', 'orderItem', 'orderItem.product', 'user'],
            take: limit,
            skip: (page - 1) * limit,
        });

        const transactionDataDto: OrderDataDto[] = allTransaction.map(transaction => {
            const transactionDto = new OrderDataDto();

            // mapping transaction data
            transactionDto.id = transaction.id;
            transactionDto.userId = transaction.user.id;
            transactionDto.userName = transaction.user.name;
            transactionDto.customerName = transaction.customerName;
            transactionDto.customerEmail = transaction.customerEmail;
            transactionDto.customerPhone = transaction.customerPhone;
            transactionDto.paymentMethod = transaction.paymentMethod;
            transactionDto.isComplete = transaction.isComplete;

            // mapping prescription data
            if (transaction.prescription) {
                const prescriptionData = new PrescriptionData();
                prescriptionData.right_sph = transaction.prescription.right_sph;
                prescriptionData.right_cylinder = transaction.prescription.right_cylinder;
                prescriptionData.right_axis = transaction.prescription.right_axis;
                prescriptionData.right_add = transaction.prescription.right_add;
                prescriptionData.right_pd = transaction.prescription.right_pd;
                prescriptionData.left_sph = transaction.prescription.left_sph;
                prescriptionData.left_cylinder = transaction.prescription.left_cylinder;
                prescriptionData.left_axis = transaction.prescription.left_axis;
                prescriptionData.left_add = transaction.prescription.left_add;
                prescriptionData.left_pd = transaction.prescription.left_pd;
                transactionDto.prescription = prescriptionData;
            }

            // mapping order item data
            if (transaction.orderItem && transaction.orderItem.length > 0) {
                transactionDto.orderItem = transaction.orderItem.map(item => {
                    const productMeta = new ProductMeta();
                    productMeta.id = item.product.id;
                    productMeta.name = item.product.name;
                    productMeta.priceBeforeTax = item.priceBeforeTax;
                    productMeta.tax = item.tax;
                    productMeta.price = item.price;
                    productMeta.totalPrice = item.totalPrice;
                    productMeta.qty = item.qty;
                    productMeta.imageUrl = item.product.imageUrl;
                    return productMeta;
                })
            }
            transactionDto.subTotal = transaction.subTotal;
            transactionDto.tax = transaction.tax;
            transactionDto.totalPrice = transaction.totalPrice;

            return transactionDto;
        })
        const totalPages = Math.ceil(totalCount / limit)
        return {
            data: transactionDataDto,
            metadata: {
                totalCount, currentPage: page, totalPages
            }
        };
    }

    async addTransaction(addTransactionDto: AddTransactionDto): Promise<OrderEntity> {
        try {
            const orderData = new OrderEntity();
            orderData.user = new UserEntity();
            orderData.user.id = addTransactionDto.userId;
            orderData.customerName = addTransactionDto.customerName;
            orderData.customerPhone = addTransactionDto.customerPhone;
            orderData.customerEmail = addTransactionDto.customerEmail;
            orderData.paymentMethod = addTransactionDto.paymentMethod;
            orderData.isComplete = addTransactionDto.isComplete;
            orderData.withPrescription = addTransactionDto.withPrescription;
            const prescription = new PrescriptionEntity();
            if (orderData.withPrescription == false) {
                prescription.right_sph = "0";
                prescription.right_cylinder = "0";
                prescription.right_axis = "0";
                prescription.right_add = "0";
                prescription.right_pd = "0";
                prescription.left_sph = "0";
                prescription.left_cylinder = "0";
                prescription.left_axis = "0";
                prescription.left_add = "0";
                prescription.left_pd = "0";
            } else {
                prescription.right_sph = addTransactionDto.prescription.right_sph;
                prescription.right_cylinder = addTransactionDto.prescription.right_cylinder;
                prescription.right_axis = addTransactionDto.prescription.right_axis;
                prescription.right_add = addTransactionDto.prescription.right_add;
                prescription.right_pd = addTransactionDto.prescription.right_pd;
                prescription.left_sph = addTransactionDto.prescription.left_sph;
                prescription.left_cylinder = addTransactionDto.prescription.left_cylinder;
                prescription.left_axis = addTransactionDto.prescription.left_axis;
                prescription.left_add = addTransactionDto.prescription.left_add;
                prescription.left_pd = addTransactionDto.prescription.left_pd;
            }
            const responsePrescription = await this.prescriptionRepository.save(prescription);

            orderData.orderItem = await Promise.all(addTransactionDto.orderItem.map(async item => {
                const orderItemData = new OrderItemsEntity();
                orderItemData.product = new ProductEntity();
                orderItemData.product.id = item.id;
                orderItemData.qty = item.quantity;
                orderItemData.priceBeforeTax = item.priceBeforeTax;
                orderItemData.tax = item.tax;
                orderItemData.price = item.price;

                orderItemData.totalPrice = item.quantity * item.price;

                // method to decrease product quantity when new order was created
                const productData = await this.productRepository.findOne(item.id);
                if (!productData) {
                    throw new Error('Product not found');
                }

                productData.quantity -= orderItemData.qty;

                await this.productRepository.save(productData);

                return orderItemData;
            }))
            orderData.prescription = responsePrescription;
            orderData.totalItem = orderData.orderItem.reduce((total, item) => total + item.qty, 0);
            orderData.subTotal = orderData.orderItem.reduce((total, item) => total + (item.qty * item.priceBeforeTax), 0);
            orderData.tax = orderData.orderItem.reduce((total, item) => total + (item.qty * item.tax), 0);
            orderData.totalPrice = orderData.subTotal + orderData.tax;
            console.log(orderData)
            // return null
            return await this.orderRepository.save(orderData);
        } catch (error) {
            console.error(error)
            throw new Error;
        }
    }

    async getTransactionById(id: string): Promise<OrderEntity> {
        const dataTransaction = await this.orderRepository.findOne(id);
        return dataTransaction;
    }

    async deleteTransaction(id: string): Promise<any> {
        try {
            return await this.orderRepository.softDelete(id)
        } catch (error) {
            throw new NotFoundException('Id not found!')
        }
    }
}