import { Module } from '@nestjs/common';
import { MICROSERVICES } from '../common/microservices.config';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';

@Module({
  imports: [],
  controllers: [SuggestionsController],
  providers: [MICROSERVICES.SUGGESTIONS, SuggestionsService],
})
export class SuggestionsModule {}
