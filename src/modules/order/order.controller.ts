import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AddTransactionDto } from "./dto/request/addTransactionDto.dto";
import { OrderEntity } from "src/entities/order.entity";
import { OrderDataDto } from "./dto/response/orderDataDto.dto";

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get('/')
    async getAllTransaction(
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
        return await this.orderService.getAllTransaction(page, limit, userName, customerName);
    }

    @Post('/')
    async addTransaction(@Body() addTrasactionDto: AddTransactionDto): Promise<OrderEntity> {
        console.log(addTrasactionDto)
        return await this.orderService.addTransaction(addTrasactionDto);
    }

    @Get('/search')
    async getTransactionById(@Query('id') id?: string): Promise<OrderEntity> {
        return await this.orderService.getTransactionById(id)
    }

    @Delete(':id')
    async deleteTransaction(@Param('id') id: string): Promise<any> {
        return await this.orderService.deleteTransaction(id);
    }
}
