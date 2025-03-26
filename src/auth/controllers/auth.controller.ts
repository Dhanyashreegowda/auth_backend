import { Body, Controller, Post, Req, UnauthorizedException,UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

   // ✅ Add this route for token refresh
   @Post('refresh')
   async refreshToken(@Body() body: any) {
     const { userId, refreshToken } = body;
     if (!userId || !refreshToken) {
       throw new UnauthorizedException('Missing userId or refreshToken');
     }
     return this.authService.refreshToken(userId, refreshToken);
   }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }
}


