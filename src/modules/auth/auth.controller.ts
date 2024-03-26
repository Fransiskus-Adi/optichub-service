import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.name, signInDto.password)
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user
    }
}