import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { createMicroserviceProvider } from '../common/microservices.config';

@Module({
  controllers: [GamesController],
  providers: [GamesService, createMicroserviceProvider('GAMES')],
  imports: [],
})
export class GamesModule {}
