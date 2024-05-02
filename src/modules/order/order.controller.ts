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
        @Query('customerName') customerName?: string
    ): Promise<{
        data: OrderDataDto[],
        metadata: {
            totalCount: number, currentPage: number, totalPages: number
        }
    }> {
        return await this.orderService.getAllOrder(page, limit, userName, customerName);
    }

    @Post('/')
    async addOrder(@Body() addTrasactionDto: AddOrderDto): Promise<OrderEntity> {
        console.log(addTrasactionDto)
        return await this.orderService.addOrder(addTrasactionDto);
    }

    @Get('/search')
    async getOrderById(@Query('id') id?: string): Promise<OrderEntity> {
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
