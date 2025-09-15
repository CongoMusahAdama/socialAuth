import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class TikTokOAuthStrategy extends PassportStrategy(OAuth2Strategy, 'tiktok') {
  constructor(private authService: AuthService) {
    const clientID = process.env.TIKTOK_CLIENT_ID;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const callbackURL = process.env.TIKTOK_REDIRECT_URI;

    if (!clientID || !clientSecret || !callbackURL) {
      console.error('❌ TikTok OAuth configuration missing:');
      console.error('   TIKTOK_CLIENT_ID:', clientID ? '✅ Set' : '❌ Missing');
      console.error('   TIKTOK_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
      console.error('   TIKTOK_REDIRECT_URI:', callbackURL ? '✅ Set' : '❌ Missing');
      throw new Error('TikTok OAuth configuration is incomplete. Please check your .env file.');
    }

    super({
      authorizationURL: 'https://www.tiktok.com/auth/authorize/',
      tokenURL: 'https://open.tiktokapis.com/v2/oauth/token/',
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user.info.basic'],
      state: true, // Enable CSRF protection
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      // Fetch user profile from TikTok API
      const profileResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const profileData = await profileResponse.json();
      const userData = profileData.data?.user;

      const user = await this.authService.validateOAuthUser({
        provider: 'tiktok',
        providerId: userData?.open_id || profile.id,
        name: userData?.display_name || 'TikTok User',
        email: undefined, // TikTok doesn't provide email in basic scope
        avatar: userData?.avatar_url,
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
