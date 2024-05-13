import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { OrderStatus } from "src/enums/order-status.enum";

export class ProductMeta {
    @IsString()
    id: string;

    @IsNumber()
    priceBeforeTax: number;

    @IsNumber()
    tax: number;

    @IsNumber()
    price: number;

    @IsNumber()
    qty: number;

    // @IsString()
    // categoryId: string;
}

export class PrescriptionData {
    @IsString()
    customerName: string;

    @IsString()
    customerPhone: string;

    @IsString()
    customerEmail: string;

    @IsString()
    right_sph: string;

    @IsString()
    right_cylinder: string;

    @IsString()
    right_axis: string;

    @IsString()
    right_add: string;

    @IsString()
    right_pd: string;

    @IsString()
    left_sph: string;

    @IsString()
    left_cylinder: string;

    @IsString()
    left_axis: string;

    @IsString()
    left_add: string;

    @IsString()
    left_pd: string;
}

export class AddOrderDto {
    @IsString()
    userId: string;

    @IsString()
    paymentMethod: string;

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsBoolean()
    withPrescription: boolean;

    @ValidateNested()
    @Type(() => PrescriptionData)
    prescription: PrescriptionData;

    @ValidateNested()
    @Type(() => ProductMeta)
    orderItem: ProductMeta[];
}