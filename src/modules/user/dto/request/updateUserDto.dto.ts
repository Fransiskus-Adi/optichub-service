import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    dob: string;

    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    password: string;
}