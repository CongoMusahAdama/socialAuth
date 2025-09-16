import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInOAuthStrategy extends PassportStrategy(LinkedInStrategy, 'linkedin') {
  constructor(private authService: AuthService) {
    const clientID = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const callbackURL = process.env.LINKEDIN_REDIRECT_URI;

    console.log('🔍 LinkedIn OAuth Configuration Check:');
    console.log('   LINKEDIN_CLIENT_ID:', clientID ? `✅ Set (${clientID.substring(0, 8)}...)` : '❌ Missing');
    console.log('   LINKEDIN_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
    console.log('   LINKEDIN_REDIRECT_URI:', callbackURL ? `✅ Set (${callbackURL})` : '❌ Missing');

    if (!clientID || !clientSecret || !callbackURL) {
      console.error('❌ LinkedIn OAuth configuration missing:');
      console.error('   LINKEDIN_CLIENT_ID:', clientID ? '✅ Set' : '❌ Missing');
      console.error('   LINKEDIN_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
      console.error('   LINKEDIN_REDIRECT_URI:', callbackURL ? '✅ Set' : '❌ Missing');
      throw new Error('LinkedIn OAuth configuration is incomplete. Please check your .env file.');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['openid', 'profile', 'email'],
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
      const user = await this.authService.validateOAuthUser({
        provider: 'linkedin',
        providerId: profile.id,
        name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
