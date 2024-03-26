import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    dob: string;

    @IsString()
    phone_number: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
}