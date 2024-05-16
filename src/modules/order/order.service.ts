import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "src/entities/order.entity";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Raw, Repository, UpdateResult } from "typeorm";
import { AddOrderDto } from "./dto/request/addOrderDto.dto";
import { PrescriptionEntity } from "src/entities/prescription.entity";
import { OrderItemsEntity } from "src/entities/order-items.entity";
import { ProductEntity } from "src/entities/product.entity";
import { UserEntity } from "src/entities/user.entity";

import { OrderDataDto, PrescriptionData, ProductMeta } from "./dto/response/orderDataDto.dto";
import { UpdateOrderDto } from "./dto/request/updateOrderDto.dto";
import { CategoryEntity } from "src/entities/category.entity";
import { OrderStatus } from "src/enums/order-status.enum";
import { ProductStatus } from "src/enums/product-status.enum";
import moment from "moment";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        public readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderItemsEntity)
        public readonly orderItemsRepository: Repository<OrderItemsEntity>,
        @InjectRepository(PrescriptionEntity)
        public readonly prescriptionRepository: Repository<PrescriptionEntity>,
        @InjectRepository(ProductEntity)
        public readonly productRepository: Repository<ProductEntity>,
    ) { }

    async getAllOrder(
        page: number = 1,
        limit: number = 10,
        keyword?: string,
        status?: string | '',
        startDate?: Date,
        endDate?: Date,
    ): Promise<{
        data: OrderDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {

        let whereConditions: any = {};

        if (keyword) {
            whereConditions = [
                { user: { name: Like(`%${keyword}%`) } },
                { prescription: { customerName: Like(`%${keyword}%`) } }
            ]
        }

        if (status !== undefined && status !== '') {
            whereConditions.status = status;
        }

        // check if start and end date was both provided, or only one
        if (startDate || endDate) {

            // hold the data based on the criteria
            let dateCondition: any = {};

            //if start date provided, filter transactionDate to start from or equal to startDate
            if (startDate) {
                dateCondition = { transactionDate: MoreThanOrEqual(startDate) };
            }
            if (endDate) {
                const endOfDate = new Date(endDate)
                // set to the very end of the day of endDate
                endOfDate.setHours(23, 59, 59, 999)

                // if startDate and endDate was provided,the thansactionDate was between
                if (startDate) {
                    dateCondition = { transactionDate: Between(startDate, endOfDate) }
                } else {
                    // only endDate provided, the transactionDate was filter less than or equal to endDate
                    dateCondition = { transactionDate: LessThanOrEqual(endOfDate) };
                }
            }
            if (Array.isArray(whereConditions)) {
                //when whereConditions were array, combine the filtered data. when startDate and endDate was provided
                whereConditions.forEach((condition: any) => {
                    Object.assign(condition, dateCondition);
                })
            } else {
                // if whereConditions above not an array, the data merged directly
                Object.assign(whereConditions, dateCondition);
            }
        }

        const [allTransaction, totalCount] = await this.orderRepository.findAndCount({
            where: whereConditions,
            relations: ['prescription', 'orderItem', 'orderItem.product', 'orderItem.product.category', 'user'],
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
            transactionDto.status = transaction.status;
            transactionDto.withPrescription = transaction.withPrescription;
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
                    productMeta.categoryName = item.product.category.name;
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
            orderData.status = addOrderDto.status;
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
            const responsePrescription = await this.prescriptionRepository.save(prescription);
            orderData.prescription = responsePrescription;

            orderData.orderItem = await Promise.all(addOrderDto.orderItem.map(async item => {
                const orderItemData = new OrderItemsEntity();
                orderItemData.product = new ProductEntity();
                orderItemData.product.id = item.id;
                orderItemData.qty = item.qty;
                orderItemData.priceBeforeTax = item.priceBeforeTax;
                orderItemData.tax = item.tax;
                orderItemData.price = item.qty * item.price;

                const productData = await this.productRepository.findOne(item.id);
                if (!productData) {
                    throw new Error('Product not found');
                }
                if (orderItemData.qty >= productData.quantity) {
                    throw new Error('Insufficient product quantity');
                }
                productData.quantity -= orderItemData.qty;

                // if (productData.quantity === 0) {
                //     productData.status = ProductStatus.INACTIVE
                // }

                await this.productRepository.save(productData);

                return orderItemData;
            }))
            orderData.totalItem = orderData.orderItem.reduce((total, item) => total + item.qty, 0);
            orderData.subTotal = orderData.orderItem.reduce((total, item) => total + (item.qty * item.priceBeforeTax), 0);
            orderData.tax = orderData.orderItem.reduce((total, item) => total + (item.qty * item.tax), 0);
            orderData.totalPrice = orderData.subTotal + orderData.tax;
            console.log(orderData)
            // return null
            const newOrder = await this.orderRepository.save(orderData);
            return newOrder;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to create order");
        }
    }

    async getOrderById(id: string): Promise<OrderDataDto> {
        const dataTransaction = await this.orderRepository.findOne({
            where: { id },
            relations: ['prescription', 'orderItem', 'orderItem.product', 'user', 'orderItem.product.category']
        });
        if (!dataTransaction) {
            throw new NotFoundException("Transaction not found")
        }

        const orderDataDto = new OrderDataDto;
        orderDataDto.id = dataTransaction.id;
        orderDataDto.userId = dataTransaction.user.id;
        orderDataDto.userName = dataTransaction.user.name;
        orderDataDto.paymentMethod = dataTransaction.paymentMethod;
        orderDataDto.status = dataTransaction.status;
        orderDataDto.withPrescription = dataTransaction.withPrescription;
        orderDataDto.prescription = {
            customerName: dataTransaction.prescription.customerName,
            customerPhone: dataTransaction.prescription.customerPhone,
            customerEmail: dataTransaction.prescription.customerEmail,
            right_sph: dataTransaction.prescription.right_sph,
            right_cylinder: dataTransaction.prescription.right_cylinder,
            right_axis: dataTransaction.prescription.right_axis,
            right_add: dataTransaction.prescription.right_add,
            right_pd: dataTransaction.prescription.right_pd,
            left_sph: dataTransaction.prescription.left_sph,
            left_cylinder: dataTransaction.prescription.left_cylinder,
            left_axis: dataTransaction.prescription.left_axis,
            left_add: dataTransaction.prescription.left_add,
            left_pd: dataTransaction.prescription.left_pd,
        }
        if (dataTransaction.orderItem && dataTransaction.orderItem.length > 0) {
            orderDataDto.orderItem = dataTransaction.orderItem.map(item => {
                const productMeta = new ProductMeta();
                productMeta.id = item.product.id;
                productMeta.name = item.product.name;
                productMeta.priceBeforeTax = item.priceBeforeTax;
                productMeta.tax = item.tax;
                productMeta.price = item.price;
                productMeta.qty = item.qty;
                productMeta.imageUrl = item.product.imageUrl;
                productMeta.categoryName = item.product.category.name;
                return productMeta;
            })
        }
        orderDataDto.subTotal = dataTransaction.subTotal;
        orderDataDto.tax = dataTransaction.tax;
        orderDataDto.totalPrice = dataTransaction.totalPrice;

        return orderDataDto;
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
            relations: ['orderItem', 'orderItem.product']
        });
        if (!orderData) {
            throw new NotFoundException("Order not found");
        }
        console.log(orderData);

        orderData.status = updateOrderDto.status;
        if (updateOrderDto.status === "cancel") {
            const updateProductQuantity = orderData.orderItem.map(async orderItem => {
                const productData = await this.productRepository.findOne(orderItem.product.id);
                if (!productData) {
                    throw new Error("Product not found");
                }

                productData.quantity += orderItem.qty;
                await this.productRepository.save(productData);
            })
            await Promise.all(updateProductQuantity);
        }

        return await this.orderRepository.save(orderData);
    }

    async getBestSellerItems(limit: number): Promise<any> {
        const bestSellerItems = await this.orderItemsRepository
            .createQueryBuilder('orderItem')
            .leftJoinAndSelect('orderItem.product', 'product')
            .select('orderItem.productId, product.name, SUM(orderItem.qty) AS totalQty')
            .groupBy('orderItem.productId, product.name')
            .orderBy('totalQty', 'DESC')
            .limit(limit)
            .getRawMany()

        return bestSellerItems;
    }

    async getTotalIncome(period: string): Promise<any[]> {
        // try {
        //     const startDate = new Date();
        //     startDate.setDate(startDate.getDate() - 7);
        //     startDate.setHours(0, 0, 0, 0)

        //     const endDate = new Date();
        //     let groupBy: string;

        //     if (period === 'month') {
        //         groupBy = 'DATE_FORMAT(transactionDate, "%Y-%m")';
        //     } else if (period === 'year') {
        //         groupBy = 'DATE_FORMAT(transactionDate, "%Y")';
        //     } else {
        //         groupBy = 'DATE_FORMAT(transactionDate, "%Y-%m-%d")';
        //     }

        //     const queryData =
        //         this.orderRepository.createQueryBuilder('order')
        //             .select(`SUM(order.totalPrice) AS totalIncome, ${groupBy} AS dateGroup`)
        //             .where('order.transactionDate BETWEEN :startDate AND :endDate', { startDate, endDate })
        //             // .andWhere('order.status = :status', { status: 'complete' })
        //             .groupBy('dateGroup')
        //             .orderBy('dateGroup', 'ASC');

        //     const reports = await queryData.getRawMany();
        //     return reports.map(report => ({
        //         day: this.formatDate(report.dateGroup, 'day'),
        //         month: this.formatDate(report.dateGroup, 'month'),
        //         year: this.formatDate(report.dateGroup, 'year'),
        //         sales: report.totalIncome,
        //         dayName: this.getDayName(new Date(report.dateGroup).getDay()),
        //         monthName: this.getMonthName(new Date(report.dateGroup).getMonth())
        //     }))
        // } catch (error) {
        //     throw error;
        // }

        let startDate: Date;
        let endDate: Date;
        const currentDate = new Date();
        const result: any[] = [];

        switch (period) {
            case 'week':
                const currentDayOfWeek = currentDate.getDay();
                const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
                startDate = new Date(currentDate.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
                endDate = currentDate;

                console.log(startDate)
                console.log(endDate)
                break;
            case 'month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                break;
            case 'year':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear() + 1, 0, 0)
                break;
            default:
                startDate = new Date(0);
                endDate = new Date(0)
                break;
        }

        const totalIncomeData = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalPrice) AS totalIncome, DATE(order.transactionDate) AS transactionDay, MONTH(order.transactionDate) AS transactionMonth')
            .where('order.transactionDate >= :startDate', { startDate })
            .groupBy('transactionDate, transactionMonth')
            .orderBy('transactionDate', 'ASC')
            .getRawMany();

        const formattedData = totalIncomeData.map(incomeRecord => {
            const formattedRecord: any = {};
            if (period === 'week') {
                formattedRecord.day = this.getDayName(new Date(incomeRecord.transactionDay).getDay());
            } else if (period === 'month') {
                formattedRecord.day = this.getDayName(new Date(incomeRecord.transactionDay).getDay());
            }
            else if (period === 'year') {
                formattedRecord.month = this.getMonthName(incomeRecord.transactionMonth);
            }
            formattedRecord.totalIncome = incomeRecord.totalIncome;
            return formattedRecord;
        });

        if (period === 'year') {
            const monthlyData = Array.from({ length: 12 }, (_, index) => {
                const monthNumber = index + 1;
                const monthName = this.getMonthName(monthNumber);
                const monthRecords = formattedData.filter(item => item.month === monthName);
                const totalIncome = monthRecords.reduce((acc, cur) => acc + parseFloat(cur.totalIncome), 0);
                return { month: monthName, totalIncome }
            })
            return monthlyData;
        }

        return formattedData;
    }

    private formatDate(dateString: string, format: 'day' | 'month' | 'year') {
        const date = new Date(dateString);
        switch (format) {
            case 'day':
                return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
            case 'month':
                return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}`;
            case 'year':
                return `${date.getFullYear()}`;
            default:
                return dateString;
        }
    }

    private padZero(num: number) {
        return num < 10 ? `0${num}` : num.toString();
    }

    getMonthName(month: number): string {
        const monthName = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return monthName[month - 1];
    }

    getDayName(day: number): string {
        const dayNames = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];
        return dayNames[day];
    }
}