import { IsDate, IsString } from "class-validator";

export class UserDataDto {
    @IsString()
    id: string;

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