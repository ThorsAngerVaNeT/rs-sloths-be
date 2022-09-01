import { Transform, Type } from 'class-transformer';
import { IsInt, IsJSON, IsOptional, Min, ValidateIf } from 'class-validator';

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

  @IsJSON()
  @IsOptional()
  @ValidateIf(({ filter }) => filter !== '')
  filter?: string;

  @IsJSON()
  @IsOptional()
  @ValidateIf(({ order }) => order !== '')
  order?: string;
}
