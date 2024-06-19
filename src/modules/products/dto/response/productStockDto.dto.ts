import { IsNumber, IsString } from "class-validator";

export class ProductStockDto {
    @IsString()
    name: string;

    @IsNumber()
    quantity: number;
}