import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { Sloth } from './entities/sloth.entity';

@Injectable()
export class SlothsService {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy
  ) {}

  async findAll(queryParams: QueryDto & { userId?: string }) {
    const { page, limit, filter, order, userId } = queryParams;
    const sloths = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth[]>>(
        { cmd: 'get_sloths' },
        {
          page,
          limit,
          ...(filter && { where: JSON.parse(filter) }),
          ...(order && { orderBy: JSON.parse(order) }),
          userId,
        }
      )
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
