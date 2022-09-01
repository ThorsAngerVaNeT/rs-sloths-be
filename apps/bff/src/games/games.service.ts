import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, ServiceResponse } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @Inject('GAMES')
    private readonly client: ClientProxy
  ) {}

  async findAll(queryParams: QueryDto) {
    const { page, limit, filter, order } = queryParams;
    const games = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<Game>>>(
        { cmd: 'get_games' },
        { page, limit, ...(filter && { where: JSON.parse(filter) }), ...(order && { orderBy: JSON.parse(order) }) }
      )
    );

    if (games.error) {
      throw new HttpException(games.error, games.status);
    }

    return games.data;
  }
}
