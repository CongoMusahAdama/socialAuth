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
      authorizationURL: 'https://www.tiktok.com/v2/auth/authorize/',
      tokenURL: 'https://open.tiktokapis.com/v2/oauth/token/',
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user.info.basic'],
      state: true, // Enable CSRF protection
      customHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      console.log('TikTok OAuth - Access token received:', accessToken ? '✅' : '❌');
      
      // Fetch user profile from TikTok API
      const profileResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!profileResponse.ok) {
        console.error('TikTok API Error:', profileResponse.status, profileResponse.statusText);
        throw new Error(`TikTok API error: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      console.log('TikTok Profile Data:', JSON.stringify(profileData, null, 2));
      
      const userData = profileData.data?.user;

      if (!userData) {
        throw new Error('No user data received from TikTok API');
      }

      const user = await this.authService.validateOAuthUser({
        provider: 'tiktok',
        providerId: userData.open_id || userData.union_id || 'unknown',
        name: userData.display_name || 'TikTok User',
        email: undefined, // TikTok doesn't provide email in basic scope
        avatar: userData.avatar_url,
      });

      console.log('TikTok OAuth - User created successfully:', user.id);
      done(null, user);
    } catch (error) {
      console.error('TikTok OAuth Error:', error);
      done(error, null);
    }
  }
}
