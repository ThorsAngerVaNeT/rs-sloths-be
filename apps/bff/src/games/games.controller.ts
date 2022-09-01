import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryDto } from '../common/query.dto';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { GamesService } from './games.service';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() queryParams: QueryDto) {
    return this.gamesService.findAll(queryParams);
  }

  @Post(':gameId/results')
  @HttpCode(201)
  async createResult(@Param('gameId', ParseUUIDPipe) gameId: string, @Body() createGameResultDto: CreateGameResultDto) {
    return this.gamesService.createResult(gameId, createGameResultDto);
  }

  @Get(':gameId/results')
  @HttpCode(200)
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
