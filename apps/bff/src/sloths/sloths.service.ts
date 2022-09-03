import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, GetAllConditions, ServiceResponse } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { Sloth } from './entities/sloth.entity';

@Injectable()
export class SlothsService {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy
  ) {}

  async findAll(conditions: GetAllConditions): Promise<GetAll<Sloth> | undefined> {
    const sloths = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<Sloth>>>({ cmd: 'get_sloths' }, conditions)
    );

    if (sloths.error) {
      throw new HttpException(sloths.error, sloths.status);
    }

    return sloths.data;
  }

  async findOne(id: string) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async findRandom(): Promise<Sloth | undefined> {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_random_sloth' }, {}));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }
}
