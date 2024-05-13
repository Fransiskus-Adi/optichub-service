import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { OrderStatus } from "src/enums/order-status.enum";

export class ProductMeta {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsNumber()
    priceBeforeTax: number;

    @IsNumber()
    tax: number;

    @IsNumber()
    price: number;

    @IsNumber()
    qty: number;

    @IsString()
    imageUrl: string;

    @IsString()
    categoryName: string;
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

export class OrderDataDto {
    @IsString()
    id: string;

    @IsString()
    userId: string;

    @IsString()
    userName: string;

    @IsString()
    paymentMethod: string;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsBoolean()
    withPrescription: boolean;

    @ValidateNested()
    @Type(() => PrescriptionData)
    prescription: PrescriptionData;

    @ValidateNested()
    @Type(() => ProductMeta)
    orderItem: ProductMeta[];

    @IsNumber()
    subTotal: number;

    @IsNumber()
    tax: number;

    @IsNumber()
    totalPrice: number;
}