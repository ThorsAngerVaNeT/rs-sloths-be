import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';

@Module({
  controllers: [SuggestionsController],
  providers: [],
})
export class SuggestionsModule {}
