import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { getOrdersArray } from '../../common/utils';
import { SuggestionStatus } from '../entities/suggestion.entity';

const orderValues = getOrdersArray(['id', 'description', 'image_url', 'userId', 'rating', 'createdAt', 'status']);

export class SuggestionsQueryDto extends OmitType(QueryDto, ['filter', 'order']) {
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  @IsEnum(SuggestionStatus, { each: true })
  filter?: SuggestionStatus[];

  @IsIn(orderValues)
  order?: string;
}
