import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService, private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) =>
        req.cookies?.['rs-sloths-cookie'] || ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  public async validate(payload: User): Promise<User | null> {
    const user = await this.authService.findUser(payload.id);
    if (user) return { ...payload };

    return null;
  }
}
