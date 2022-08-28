import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUGGESTIONS',
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [SuggestionsController],
  providers: [],
})
export class SuggestionsModule {}
