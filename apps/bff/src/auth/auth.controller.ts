import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Public } from '../rbac/public.decorator';
import { RequestWithUser } from '../app.interfaces';
import { Roles } from '../rbac/roles.decorator';
import { ROLE } from '../users/entities/user.entity';
import { GithubAuthGuard } from './guards/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('github')
  @Public()
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    return { msg: 'Github Authentication' };
  }

  @Get('github/callback')
  @Public()
  @UseGuards(GithubAuthGuard)
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;

    const { createdAt, ...payload } = user;
    res.cookie(`${this.configService.get('COOKIE_NAME')}`, this.jwtService.sign(payload), {
      expires: new Date(Date.now() + +this.configService.get('JWT_EXPIRATION_TIME_MILLISECONDS')),
      httpOnly: true,
      secure: true,
      domain: `${this.configService.get('FRONT_DOMAIN')}`,
      sameSite: 'none',
    });
    res.redirect(`${this.configService.get('FRONT_URL')}`);
  }

  @Get('github/logout')
  @Roles(ROLE.admin, ROLE.user)
  githubLogout(@Res() res: Response) {
    res.clearCookie(`${this.configService.get('COOKIE_NAME')}`);
    res.redirect(`${this.configService.get('FRONT_URL')}`);
  }
}
