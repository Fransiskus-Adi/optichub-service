import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductStatus } from "src/enums/product-status.enum";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    price: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsString()
    quantity: string;

    @IsString()
    categoryId: string;
}