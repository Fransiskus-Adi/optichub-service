import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserStatus } from "src/enums/user-status.enum";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    dob: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

    @IsString()
    phone_number: string;

    @IsString()
    password: string;

    @IsString()
    role: string;

    @IsString()
    nik: string;
}