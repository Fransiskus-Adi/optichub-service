import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/order.entity";
import { Like, Raw, Repository, UpdateResult } from "typeorm";
import { AddOrderDto } from "./dto/request/addOrderDto.dto";
import { PrescriptionEntity } from "src/entities/prescription.entity";
import { OrderItemsEntity } from "src/entities/order-items.entity";
import { ProductEntity } from "src/entities/product.entity";
import { UserEntity } from "src/entities/user.entity";

import { OrderDataDto, PrescriptionData, ProductMeta } from "./dto/response/orderDataDto.dto";
import { UpdateOrderDto } from "./dto/request/updateOrderDto.dto";

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

    async getAllOrder(
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
            transactionDto.paymentMethod = transaction.paymentMethod;
            transactionDto.isComplete = transaction.isComplete;

            // mapping prescription data
            if (transaction.prescription) {
                const prescriptionData = new PrescriptionData();
                prescriptionData.customerName = transaction.prescription.customerName;
                prescriptionData.customerPhone = transaction.prescription.customerPhone;
                prescriptionData.customerEmail = transaction.prescription.customerEmail;
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

    async addOrder(addOrderDto: AddOrderDto): Promise<OrderEntity> {
        try {
            const orderData = new OrderEntity();
            orderData.user = new UserEntity();
            orderData.user.id = addOrderDto.userId;
            orderData.paymentMethod = addOrderDto.paymentMethod;
            orderData.isComplete = addOrderDto.isComplete;
            orderData.withPrescription = addOrderDto.withPrescription;
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
                prescription.right_sph = addOrderDto.prescription.right_sph;
                prescription.right_cylinder = addOrderDto.prescription.right_cylinder;
                prescription.right_axis = addOrderDto.prescription.right_axis;
                prescription.right_add = addOrderDto.prescription.right_add;
                prescription.right_pd = addOrderDto.prescription.right_pd;
                prescription.left_sph = addOrderDto.prescription.left_sph;
                prescription.left_cylinder = addOrderDto.prescription.left_cylinder;
                prescription.left_axis = addOrderDto.prescription.left_axis;
                prescription.left_add = addOrderDto.prescription.left_add;
                prescription.left_pd = addOrderDto.prescription.left_pd;
            }
            prescription.customerName = addOrderDto.prescription.customerName;
            prescription.customerEmail = addOrderDto.prescription.customerEmail;
            prescription.customerPhone = addOrderDto.prescription.customerPhone;

            orderData.orderItem = await Promise.all(addOrderDto.orderItem.map(async item => {
                const orderItemData = new OrderItemsEntity();
                orderItemData.product = new ProductEntity();
                orderItemData.product.id = item.id;
                orderItemData.qty = item.quantity;
                orderItemData.priceBeforeTax = item.priceBeforeTax;
                orderItemData.tax = item.tax;
                orderItemData.price = item.quantity * item.price;

                // verify if the order was complete to prevent cancel order
                // method to decrease product quantity when new order was created
                const productData = await this.productRepository.findOne(item.id);
                if (!productData) {
                    throw new Error('Product not found');
                }
                if (orderItemData.qty >= productData.quantity) {
                    throw new Error('Insufficient product quantity');
                }
                if (orderData.isComplete === true) {
                    productData.quantity -= orderItemData.qty;

                    await this.productRepository.save(productData);
                }

                return orderItemData;
            }))
            orderData.totalItem = orderData.orderItem.reduce((total, item) => total + item.qty, 0);
            orderData.subTotal = orderData.orderItem.reduce((total, item) => total + (item.qty * item.priceBeforeTax), 0);
            orderData.tax = orderData.orderItem.reduce((total, item) => total + (item.qty * item.tax), 0);
            orderData.totalPrice = orderData.subTotal + orderData.tax;
            console.log(orderData)
            // return null
            const newOrder = await this.orderRepository.save(orderData);
            if (newOrder) {
                const responsePrescription = await this.prescriptionRepository.save(prescription);
                orderData.prescription = responsePrescription;
            }
            return newOrder;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to create order");
        }
    }

    async getOrderById(id: string): Promise<OrderEntity> {
        const dataTransaction = await this.orderRepository.findOne(id);
        return dataTransaction;
    }

    async deleteOrder(id: string): Promise<any> {
        try {
            return await this.orderRepository.softDelete(id)
        } catch (error) {
            throw new NotFoundException('Id not found!')
        }
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
        const orderData = await this.orderRepository.findOne(
            id, {
            relations: ['orderItem']
        });
        if (!orderData) {
            throw new NotFoundException("Order not found");
        }

        orderData.isComplete = updateOrderDto.isComplete;
        if (updateOrderDto.isComplete === true) {
            const updateProductQuantity = orderData.orderItem.map(async orderItem => {
                orderItem.product = new ProductEntity();
                const productData = await this.productRepository.findOne(orderItem.product.id);
                if (!productData) {
                    throw new Error("Product not found");
                }
                if (orderItem.qty >= productData.quantity) {
                    throw new Error("Insufficient product quantity");
                }
                productData.quantity -= orderItem.qty;
                await this.productRepository.save(productData);
            })
            await Promise.all(updateProductQuantity);
        }

        return await this.orderRepository.save(orderData);
    }
}