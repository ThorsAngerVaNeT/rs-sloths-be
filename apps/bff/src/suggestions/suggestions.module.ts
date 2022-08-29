import { Module } from '@nestjs/common';
import { createMicroserviceProvider } from '../common/microservices.config';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [],
  controllers: [SuggestionsController],
  providers: [createMicroserviceProvider('SUGGESTIONS')],
})
export class SuggestionsModule {}
