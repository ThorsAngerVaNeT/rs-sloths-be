import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { GithubAuthGuard } from './guards/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  // eslint-disable-next-line class-methods-use-this
  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubLogin() {
    return { msg: 'Github Authentication' };
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  githubCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
    const { user } = req;

    const { createdAt, ...payload } = user;
    res.cookie('rs-sloths-cookie', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + +this.configService.get('JWT_EXPIRATION_TIME_MILLISECONDS')),
      httpOnly: true,
      secure: true,
      domain: `${this.configService.get('FRONT_DOMAIN')}`,
      sameSite: 'none',
    });
    res.redirect(`${this.configService.get('FRONT_URL')}`);
  }
}
