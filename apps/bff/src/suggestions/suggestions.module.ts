import { Module } from '@nestjs/common';
import { MICROSERVICES } from '../common/microservices.config';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [],
  controllers: [SuggestionsController],
  providers: [MICROSERVICES.SUGGESTIONS],
})
export class SuggestionsModule {}
