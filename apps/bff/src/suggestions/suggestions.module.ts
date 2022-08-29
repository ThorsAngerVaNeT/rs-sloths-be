import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [],
  controllers: [SuggestionsController],
  providers: [
    {
      provide: 'SUGGESTIONS',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('SUGGESTIONS_SERVICE_PORT');
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
export class SuggestionsModule {}
