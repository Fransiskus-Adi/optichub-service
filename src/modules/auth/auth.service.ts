import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User Not Found!');
        }

        //validate the input password was same with password on db using compare
        const validatePass = await compare(password, user.password)
        if (!validatePass) {
            throw new UnauthorizedException("Wrong Password!");
        }

        const payload = { sub: user.id, name: user.email }
        return {
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}