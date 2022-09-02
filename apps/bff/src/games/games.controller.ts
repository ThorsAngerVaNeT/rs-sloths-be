import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryDto } from '../common/query.dto';
import { Roles } from '../rbac/roles.decorator';
import { ROLE } from '../users/entities/user.entity';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { GamesService } from './games.service';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Roles(ROLE.admin)
  @HttpCode(200)
  async findAll(@Query() queryParams: QueryDto) {
    return this.gamesService.findAll(queryParams);
  }

  @Post(':gameId/results')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(201)
  async createResult(@Param('gameId', ParseUUIDPipe) gameId: string, @Body() createGameResultDto: CreateGameResultDto) {
    return this.gamesService.createResult(gameId, createGameResultDto);
  }

  @Get(':gameId/results')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAllResults(
    @Req() req: RequestWithUser,
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Query() queryParams: QueryDto
  ) {
    const { user } = req;
    return this.gamesService.findAllResults(gameId, queryParams, user);
  }
}
