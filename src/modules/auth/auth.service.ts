import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(name: string, password: string): Promise<any> {
        const user = await this.userService.findByName(name);
        if (!user) {
            throw new UnauthorizedException('User Not Found!');
        }

        const validatePass = await compare(password, user.password)
        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, name: user.name }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}