import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsBoolean()
    status: boolean;

    @IsNumber()
    quantity: number;

    @IsString()
    image_url: string;

    @IsString()
    categoryId: string;
}