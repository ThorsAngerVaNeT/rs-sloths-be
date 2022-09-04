import { OmitType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { getOrdersArray } from '../../common/utils';

const orderValues = getOrdersArray(['id', 'caption', 'description', 'image_url', 'rating', 'createdAt']);

export class SlothsQueryDto extends OmitType(QueryDto, ['order']) {
  @IsIn(orderValues)
  @IsOptional()
  order?: string;
}
