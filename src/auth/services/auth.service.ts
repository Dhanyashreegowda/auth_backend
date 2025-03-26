import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Signup
  async signup(signupDto: SignupDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ email, password: hashedPassword });

    // Generate Tokens
    const accessToken = this.generateToken(user, 'access');
    const refreshToken = this.generateToken(user, 'refresh');
    await this.userService.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  // ✅ Login
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('No account found with this email');
    }
  
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
  
    const accessToken = this.generateToken(user, 'access');
    const refreshToken = this.generateToken(user, 'refresh');
    
    await this.userService.update(user.id, { refreshToken });
    
    return { accessToken, refreshToken };
  }

  // ✅ Refresh Token
  async refreshToken(userId: number, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  
    const newAccessToken = this.generateToken(user, 'access');
    const newRefreshToken = this.generateToken(user, 'refresh');
  
    await this.userService.update(userId, { refreshToken: newRefreshToken });
  
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
  
  

  // ✅ Logout (Invalidate Refresh Token)
  async logout(userId: number): Promise<void> {
    await this.userService.update(userId, { refreshToken: null });
  }

  // ✅ Generate Token
  private generateToken(user: User, type: 'access' | 'refresh'): string {
    const payload = { id: user.id, email: user.email };

    return this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: type === 'access' ? jwtConfig.accessTokenExpiry : jwtConfig.refreshTokenExpiry,
    });
  }
}
