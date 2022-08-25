import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse, UserValidateData } from '../app.interfaces';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS')
    private readonly client: ClientProxy
  ) {}

  async validateUser(userData: UserValidateData) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'validate' }, userData));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  async findUser(id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'get_user' }, id));
    return user.data;
  }
}
