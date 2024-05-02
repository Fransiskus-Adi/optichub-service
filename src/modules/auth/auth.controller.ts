import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.email, signInDto.password)
    }
}