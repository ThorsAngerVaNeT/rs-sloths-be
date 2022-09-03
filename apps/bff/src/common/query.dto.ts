import { Transform, Type } from 'class-transformer';
import { IsInt, IsJSON, IsOptional, IsString, IsUUID, Min, ValidateIf } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  @ValidateIf(({ limit }) => limit !== '')
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  filter?: string[];

  @IsString()
  @IsOptional()
  searchText: string;

  @IsJSON()
  @IsOptional()
  @ValidateIf(({ order }) => order !== '')
  order?: string;

  @IsUUID(4)
  @IsOptional()
  @ValidateIf(({ userId }) => userId !== '')
  userId?: string;
}
