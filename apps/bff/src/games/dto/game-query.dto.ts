import { OmitType } from '@nestjs/mapped-types';
import { IsIn } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { getOrdersArray } from '../../common/utils';

const orderValues = getOrdersArray(['id', 'name']);

export class GameQueryDto extends OmitType(QueryDto, ['filter', 'order']) {
  @IsIn(orderValues)
  order?: string;
}
