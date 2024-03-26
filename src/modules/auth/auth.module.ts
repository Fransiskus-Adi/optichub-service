import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { jwtConstant } from "./constant";
import { AuthGuard } from "src/guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstant.secret,
            signOptions: { expiresIn: '1d' }
        })
    ],
    providers: [AuthService,
        // {
        //     provide: APP_GUARD,
        //     useClass: AuthGuard
        // }
    ],
    controllers: [AuthController],
    exports: [AuthService],
})

export class AuthModule { }