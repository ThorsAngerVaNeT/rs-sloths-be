import { Controller, Get, Query } from '@nestjs/common';
import { QueryDto } from '../common/query.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(@Query() queryParams: QueryDto) {
    return this.gamesService.findAll(queryParams);
  }
}
