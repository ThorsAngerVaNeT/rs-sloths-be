/* eslint-disable class-methods-use-this */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './github.guard';

@Controller('auth')
export class AuthController {
  @Get('github')
  @UseGuards(GithubAuthGuard)
  handleLogin() {
    return { msg: 'Github Authentication' };
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  login() {
    return { msg: 'OK' };
  }
}
