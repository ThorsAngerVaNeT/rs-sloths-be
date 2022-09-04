import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MICROSERVICES } from '../common/microservices.config';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService, MICROSERVICES.GAMES],
  imports: [UsersModule],
})
export class GamesModule {}
