import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { getOrdersArray } from '../../common/utils';
import { ROLE } from '../entities/user.entity';

const orderValues = getOrdersArray(['id', 'name', 'github', 'image_url', 'createdAt', 'role']);
export class UsersQueryDto extends OmitType(QueryDto, ['filter', 'order']) {
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  @IsEnum(ROLE, { each: true })
  filter?: ROLE[];

  @IsIn(orderValues)
  order?: string;
}
