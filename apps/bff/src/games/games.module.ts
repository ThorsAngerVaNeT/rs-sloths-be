import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  controllers: [GamesController],
  providers: [
    GamesService,
    {
      provide: 'GAMES',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('GAMES_SERVICE_PORT');
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class GamesModule {}
