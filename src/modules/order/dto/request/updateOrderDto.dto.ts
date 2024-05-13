import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/enums/order-status.enum";

export class UpdateOrderDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;
}