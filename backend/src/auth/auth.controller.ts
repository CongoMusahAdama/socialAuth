import { Controller, Get, Post, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {
    // This will redirect to LinkedIn OAuth
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(@Req() req: Request, @Res() res: Response) {
    const user: User = req.user as User;
    const loginResult = await this.authService.login(user);
    
    // Set httpOnly cookie
    res.cookie('token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/profile?success=true`);
  }

  @Get('tiktok')
  @UseGuards(AuthGuard('tiktok'))
  async tiktokAuth() {
    // This will redirect to TikTok OAuth
  }

  @Get('tiktok/callback')
  @UseGuards(AuthGuard('tiktok'))
  async tiktokCallback(@Req() req: Request, @Res() res: Response) {
    const user: User = req.user as User;
    const loginResult = await this.authService.login(user);
    
    // Set httpOnly cookie
    res.cookie('token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/profile?success=true`);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  }
}

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      message: 'Backend is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user: User = req.user as User;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
    };
  }
}
