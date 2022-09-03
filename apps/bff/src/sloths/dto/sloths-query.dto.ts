import { OmitType } from '@nestjs/mapped-types';
import { IsIn } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { getOrdersArray } from '../../common/utils';

const orderValues = getOrdersArray(['id', 'caption', 'description', 'image_url', 'rating', 'createdAt']);

export class GameQueryDto extends OmitType(QueryDto, ['order']) {
  @IsIn(orderValues)
  order?: string;
}
