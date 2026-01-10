import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    handleOptions(res: Response): void;
    register(registerDto: RegisterDto): Promise<import("./dto/auth.dto").AuthResponse>;
    login(loginDto: LoginDto): Promise<import("./dto/auth.dto").AuthResponse>;
    getAllUsers(): Promise<import("./user.entity").User[]>;
}
