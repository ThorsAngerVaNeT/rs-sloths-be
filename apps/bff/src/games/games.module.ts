import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MICROSERVICES } from '../common/microservices.config';

@Module({
  controllers: [GamesController],
  providers: [GamesService, MICROSERVICES.GAMES],
  imports: [],
})
export class GamesModule {}
