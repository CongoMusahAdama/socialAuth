import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController, AppController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { LinkedInOAuthStrategy } from './strategies/linkedin.strategy';
import { TikTokOAuthStrategy } from './strategies/tiktok.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController, AppController],
  providers: [
    AuthService,
    JwtStrategy,
    LinkedInOAuthStrategy,
    TikTokOAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
