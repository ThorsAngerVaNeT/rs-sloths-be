import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService, private configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_OAUTH_CALLBACK_URL'),
      scope: ['read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateUser({
      github: profile.username,
      name: profile.displayName,
    });
    return user || null;
  }
}
