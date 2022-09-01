import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Game, GameResult, Prisma } from '@prisma/client';
import { GetAll, GetAllConditions, ServiceResponse } from './app.interfaces';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_games' })
  async getGames(params: GetAllConditions): Promise<ServiceResponse<GetAll<Game>>> {
    return this.appService.getGames(params);
  }

  @MessagePattern({ cmd: 'get_game_results' })
  async getGameResults(params: GetAllConditions): Promise<ServiceResponse<GetAll<GameResult>>> {
    return this.appService.getGameResults(params);
  }

  @MessagePattern({ cmd: 'create_game_result' })
  async createGameResult(createGameResultDto: Prisma.GameResultCreateInput): Promise<ServiceResponse<GameResult>> {
    return this.appService.createGameResult(createGameResultDto);
  }
}
