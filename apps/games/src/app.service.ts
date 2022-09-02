import { HttpStatus, Injectable } from '@nestjs/common';
import { Game, GameResult, Prisma } from '@prisma/client';
import { GetAll, GetAllConditions, ServiceResponse } from './app.interfaces';
import { PrismaService } from './prisma/prisma.service';
import { getPrismaOptions } from './utils';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  public async getGames(params: GetAllConditions): Promise<ServiceResponse<GetAll<Game>>> {
    const { skip, take, conditions } = getPrismaOptions(params);

    const [count, items] = await this.prisma.$transaction([
      this.prisma.game.count(conditions),
      this.prisma.game.findMany({
        ...conditions,
        skip,
        take,
      }),
    ]);

    return { data: { count, items }, status: HttpStatus.OK };
  }

  public async getGameResults(params: GetAllConditions): Promise<ServiceResponse<GetAll<GameResult>>> {
    const { skip, take, conditions } = getPrismaOptions(params);

    const [count, items] = await this.prisma.$transaction([
      this.prisma.gameResult.count(conditions),
      this.prisma.gameResult.findMany({
        ...conditions,
        skip,
        take,
      }),
    ]);

    return { data: { count, items }, status: HttpStatus.OK };
  }

  public async createGameResult(data: Prisma.GameResultCreateInput): Promise<ServiceResponse<GameResult>> {
    const newGameResult = await this.prisma.gameResult.create({
      data,
    });
    return { data: newGameResult, status: HttpStatus.CREATED };
  }
}
