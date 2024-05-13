import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class ProductDataDto {
    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsNumber()
    priceBeforeTax: number;

    @Expose()
    @IsNumber()
    tax: number;

    @Expose()
    @IsNumber()
    price: number;

    @Expose()
    @IsString()
    status: string;

    @Expose()
    @IsNumber()
    quantity: number;

    @Expose()
    @IsString()
    imageUrl: string;

    @Expose()
    @IsString()
    categoryId: string;
}