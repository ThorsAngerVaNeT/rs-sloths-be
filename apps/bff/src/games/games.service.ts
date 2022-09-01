/* eslint-disable class-methods-use-this */
import { ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, ServiceResponse } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
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

  async createResult(gameId: string, createGameResultDto: CreateGameResultDto) {
    return 'This action adds a new result';
  }

  async findAllResults(gameId: string, queryParams: QueryDto & { userId?: string }, userId?: string) {
    const { page, limit, filter, order, userId: userIdParam } = queryParams;

    if (userIdParam !== userId) throw new ForbiddenException();

    const results = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<GameResult>>>(
        { cmd: 'get_game_results' },
        {
          gameId,
          page,
          limit,
          ...(filter && { where: JSON.parse(filter) }),
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
