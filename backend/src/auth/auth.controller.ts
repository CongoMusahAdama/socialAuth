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
  async linkedinAuth(@Res() res: Response) {
    const clientID = process.env.LINKEDIN_CLIENT_ID;
    const redirectURI = process.env.LINKEDIN_REDIRECT_URI;
    
    console.log('🔍 LinkedIn OAuth Configuration Check:');
    console.log('   LINKEDIN_CLIENT_ID:', clientID ? `✅ Set (${clientID.substring(0, 8)}...)` : '❌ Missing');
    console.log('   LINKEDIN_REDIRECT_URI:', redirectURI ? `✅ Set (${redirectURI})` : '❌ Missing');
    
    if (!clientID || !redirectURI) {
      console.error('❌ LinkedIn OAuth configuration missing');
      return res.status(500).json({ error: 'LinkedIn OAuth not configured' });
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientID);
    authUrl.searchParams.set('redirect_uri', redirectURI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', 'openid profile email');

    console.log('🔗 Redirecting to LinkedIn OAuth:', authUrl.toString());
    res.redirect(authUrl.toString());
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
  async tiktokAuth(@Res() res: Response) {
    const clientID = process.env.TIKTOK_CLIENT_ID;
    const redirectURI = process.env.TIKTOK_REDIRECT_URI;
    
    console.log('🔍 TikTok OAuth Configuration Check:');
    console.log('   TIKTOK_CLIENT_ID:', clientID ? `✅ Set (${clientID.substring(0, 8)}...)` : '❌ Missing');
    console.log('   TIKTOK_REDIRECT_URI:', redirectURI ? `✅ Set (${redirectURI})` : '❌ Missing');
    
    if (!clientID || !redirectURI) {
      console.error('❌ TikTok OAuth configuration missing');
      return res.status(500).json({ error: 'TikTok OAuth not configured' });
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
    authUrl.searchParams.set('client_key', clientID);
    authUrl.searchParams.set('scope', 'user.info.basic');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectURI);
    authUrl.searchParams.set('state', state);

    console.log('🔗 Redirecting to TikTok OAuth:', authUrl.toString());
    res.redirect(authUrl.toString());
  }

  @Get('tiktok/callback')
  @UseGuards(AuthGuard('tiktok'))
  async tiktokCallback(@Req() req: Request, @Res() res: Response) {
    try {
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
    } catch (error) {
      console.error('TikTok callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/?error=tiktok_auth_failed`);
    }
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
