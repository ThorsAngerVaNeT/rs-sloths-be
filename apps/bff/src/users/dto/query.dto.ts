import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query.dto';
import { ROLE } from '../entities/user.entity';

export class UsersQueryDto extends OmitType(QueryDto, ['filter']) {
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  @IsEnum(ROLE, { each: true })
  filter?: ROLE[];
}
