import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { SuggestionStatus } from '../entities/suggestion.entity';

export class SuggestionsQueryDto extends OmitType(QueryDto, ['filter']) {
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  @IsEnum(SuggestionStatus, { each: true })
  filter?: SuggestionStatus[];
}
