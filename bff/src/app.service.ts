import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private helloText = 'Hello World!') {}

  getHello(): string {
    return this.helloText;
  }
}
