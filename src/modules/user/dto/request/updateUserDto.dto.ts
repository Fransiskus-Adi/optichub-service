import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { UserStatus } from "src/enums/user-status.enum";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    dob?: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

    @IsString()
    @IsOptional()
    phone_number?: string;

    @IsString()
    @IsOptional()
    password?: string;
}