import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/app.interfaces';
import { Sloth } from './entities/sloth.entity';

@Injectable()
export class SlothsService {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy
  ) {}

  async findRandom() {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_random_sloth' }, {}));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }
}
