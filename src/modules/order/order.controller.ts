import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AddOrderDto } from "./dto/request/addOrderDto.dto";
import { OrderEntity } from "src/entities/order.entity";
import { OrderDataDto } from "./dto/response/orderDataDto.dto";
import { UpdateOrderDto } from "./dto/request/updateOrderDto.dto";

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('/')
    async getAllOrder(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('userName') userName?: string,
        @Query('customerName') customerName?: string,
        @Query('status') status?: string | '',
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
    ): Promise<{
        data: OrderDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {
        //convert startDate and endDate from string to object
        const startDateObj = startDate ? new Date(startDate) : undefined;
        const endDateObj = endDate ? new Date(endDate) : undefined;
        return await this.orderService.getAllOrder(page, limit, userName, customerName, status, startDateObj, endDateObj);
    }

    @Get('/best-seller')
    async getBestSellerItems(): Promise<any> {
        const limit = 10;
        return this.orderService.getBestSellerItems(limit);
    }

    @Get('/total-income')
    async getTotalIncome(@Query('period') period: string): Promise<any[]> {
        const totalIncome = await this.orderService.getTotalIncome(period);
        return totalIncome;
    }

    @Post('/')
    async addOrder(@Body() addTrasactionDto: AddOrderDto): Promise<OrderEntity> {
        console.log(addTrasactionDto)
        return await this.orderService.addOrder(addTrasactionDto);
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string): Promise<OrderDataDto> {
        return await this.orderService.getOrderById(id)
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<any> {
        return await this.orderService.deleteOrder(id);
    }

    @Patch(':id')
    async updateOrder(@Param() id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
        return await this.orderService.updateOrder(id, updateOrderDto);
    }
}
