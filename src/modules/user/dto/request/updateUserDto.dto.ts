import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    password: string;
}