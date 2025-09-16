import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class TikTokOAuthStrategy extends PassportStrategy(Strategy, 'tiktok') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { code, state } = req.query;
    
    if (!code) {
      throw new Error('Authorization code not provided');
    }

    try {
      const clientID = process.env.TIKTOK_CLIENT_ID;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      const redirectURI = process.env.TIKTOK_REDIRECT_URI;

      if (!clientID || !clientSecret || !redirectURI) {
        throw new Error('TikTok OAuth configuration is incomplete');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: clientID,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectURI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('TikTok Token Error:', tokenResponse.status, errorText);
        throw new Error(`TikTok token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('TikTok Token Response:', JSON.stringify(tokenData, null, 2));

      const accessToken = tokenData.data?.access_token;
      if (!accessToken) {
        throw new Error('No access token received from TikTok');
      }

      // Fetch user profile
      const profileResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('TikTok Profile Error:', profileResponse.status, errorText);
        throw new Error(`TikTok profile fetch failed: ${profileResponse.status}`);
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
        email: undefined,
        avatar: userData.avatar_url,
      });

      return user;
    } catch (error) {
      console.error('TikTok OAuth Error:', error);
      throw error;
    }
  }

}
