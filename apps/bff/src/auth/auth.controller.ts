/* eslint-disable class-methods-use-this */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { GithubAuthGuard } from './guards/github.guard';

const twoDaysMs = 1000 * 60 * 60 * 24 * 2;

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubLogin() {
    return { msg: 'Github Authentication' };
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  githubCallback(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    const { createdAt, ...payload } = user as User;

    res.cookie('rs-sloths-cookie', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + twoDaysMs),
      httpOnly: true,
      secure: true,
      domain: 'localhost',
      sameSite: 'none',
    });
    res.redirect(`http://localhost:5173/`);
  }
}
