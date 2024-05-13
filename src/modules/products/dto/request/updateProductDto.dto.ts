import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductStatus } from "src/enums/product-status.enum";

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    priceBeforeTax?: string;

    @IsString()
    @IsOptional()
    tax?: string;

    @IsString()
    @IsOptional()
    price?: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsString()
    @IsOptional()
    quantity?: string;

    // @IsString()
    // @IsOptional()
    // imageUrl?: string;

    @IsString()
    @IsOptional()
    categoryId?: string;
}