import { ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, ServiceResponse, WhereFieldEquals } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { getWhere } from '../common/utils';
import { ROLE, User } from '../users/entities/user.entity';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { GameResult } from './entities/game-result.entity';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @Inject('GAMES')
    private readonly client: ClientProxy
  ) {}

  async findAll(queryParams: QueryDto) {
    const { page, limit, order, searchString } = queryParams;

    const where = getWhere({ searchString, searchFields: ['name'] });

    const games = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<Game>>>(
        { cmd: 'get_games' },
        { page, limit, ...(where && { where }), ...(order && { orderBy: JSON.parse(order) }) }
      )
    );

    if (games.error) {
      throw new HttpException(games.error, games.status);
    }

    return games.data;
  }

  async createResult(gameId: string, createGameResultDto: CreateGameResultDto) {
    const { count, time, userId } = createGameResultDto;

    const results = await firstValueFrom(
      this.client.send<ServiceResponse<GameResult>>({ cmd: 'create_game_result' }, { gameId, count, time, userId })
    );

    if (results.error) {
      throw new HttpException(results.error, results.status);
    }

    return results.data;
  }

  async findAllResults(gameId: string, queryParams: QueryDto, user?: User) {
    const { page, limit, order, userId: userIdParam } = queryParams;

    if (userIdParam && userIdParam !== user?.id && user?.role !== ROLE.admin) throw new ForbiddenException();

    const where: WhereFieldEquals = { gameId };
    if (userIdParam) {
      where.userId = user?.id;
    }

    const results = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<GameResult>>>(
        { cmd: 'get_game_results' },
        {
          page,
          limit,
          where,
          ...(order && { orderBy: JSON.parse(order) }),
        }
      )
    );

    if (results.error) {
      throw new HttpException(results.error, results.status);
    }

    return results.data;
  }
}
