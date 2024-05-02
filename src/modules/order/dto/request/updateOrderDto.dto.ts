import { IsBoolean, IsOptional } from "class-validator";

export class UpdateOrderDto {
    @IsBoolean()
    isComplete: boolean;
}