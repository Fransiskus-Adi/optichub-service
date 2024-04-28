import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsNumber()
    @IsOptional()
    quantity: number;

    @IsString()
    @IsOptional()
    imageUrl: string;

    @IsString()
    @IsOptional()
    categoryId: string;
}