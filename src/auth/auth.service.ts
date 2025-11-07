import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { username, password, confirmPassword } = registerDto;

    // Validate password match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username }
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: savedUser.id, 
      username: savedUser.username 
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        username: savedUser.username,
      },
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { username }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      username: user.username 
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId, is_active: true }
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'username', 'is_active', 'created_at']
    });
  }
}