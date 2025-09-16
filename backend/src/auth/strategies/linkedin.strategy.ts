import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInOAuthStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req: any): Promise<any> {
    const { code, state } = req.query;
    
    if (!code) {
      return this.fail('Authorization code not provided');
    }

    try {
      const clientID = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      const redirectURI = process.env.LINKEDIN_REDIRECT_URI;

      console.log('🔍 LinkedIn OAuth Configuration Check:');
      console.log('   LINKEDIN_CLIENT_ID:', clientID ? `✅ Set (${clientID.substring(0, 8)}...)` : '❌ Missing');
      console.log('   LINKEDIN_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
      console.log('   LINKEDIN_REDIRECT_URI:', redirectURI ? `✅ Set (${redirectURI})` : '❌ Missing');

      if (!clientID || !clientSecret || !redirectURI) {
        console.error('❌ LinkedIn OAuth configuration missing');
        return this.fail('LinkedIn OAuth configuration is incomplete');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectURI,
          client_id: clientID,
          client_secret: clientSecret,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('LinkedIn Token Error:', tokenResponse.status, errorText);
        return this.fail(`LinkedIn token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('LinkedIn Token Response:', JSON.stringify(tokenData, null, 2));

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return this.fail('No access token received from LinkedIn');
      }

      // Fetch user profile using the LinkedIn API
      // Try the newer userinfo endpoint first, fallback to legacy if needed
      let profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      let profileData;
      
      if (!profileResponse.ok) {
        console.log('Userinfo endpoint failed, trying legacy profile endpoint...');
        // Fallback to legacy profile endpoint
        profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('LinkedIn Profile Error:', profileResponse.status, errorText);
          return this.fail(`LinkedIn profile fetch failed: ${profileResponse.status}`);
        }
        
        const legacyData = await profileResponse.json();
        console.log('LinkedIn Legacy Profile Data:', JSON.stringify(legacyData, null, 2));
        
        // Transform legacy data to match expected format
        profileData = {
          sub: legacyData.id,
          name: `${legacyData.firstName?.localized?.en_US || ''} ${legacyData.lastName?.localized?.en_US || ''}`.trim(),
          email: legacyData.emailAddress,
          picture: legacyData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
        };
      } else {
        profileData = await profileResponse.json();
        console.log('LinkedIn Profile Data:', JSON.stringify(profileData, null, 2));
      }

      if (!profileData.sub && !profileData.id) {
        return this.fail('No user data received from LinkedIn API');
      }

      const user = await this.authService.validateOAuthUser({
        provider: 'linkedin',
        providerId: profileData.sub || profileData.id,
        name: profileData.name || `${profileData.given_name || ''} ${profileData.family_name || ''}`.trim() || 'LinkedIn User',
        email: profileData.email,
        avatar: profileData.picture,
      });

      this.success(user);
    } catch (error) {
      console.error('LinkedIn OAuth Error:', error);
      this.fail(error);
    }
  }
}
