import { IsDate, IsString } from "class-validator";

export class FindAllUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsDate()
    dob: Date;

    @IsString()
    phone_number: string;

    @IsString()
    role: string;
}