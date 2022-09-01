import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, Res } from '@nestjs/common';
import { RequestWithUser } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(@Query() queryParams: QueryDto) {
    return this.gamesService.findAll(queryParams);
  }

  @Post(':gameId/results')
  async createResult(@Param('gameId', ParseUUIDPipe) gameId: string, @Body() createGameResultDto: CreateGameResultDto) {
    return this.gamesService.createResult(gameId, createGameResultDto);
  }

  @Get(':gameId/results')
  async findAllResults(
    @Req() req: RequestWithUser,
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Query() queryParams: QueryDto & { userId?: string }
  ) {
    const {
      user: { id: userId },
    } = req;
    return this.gamesService.findAllResults(gameId, queryParams, userId);
  }
}
