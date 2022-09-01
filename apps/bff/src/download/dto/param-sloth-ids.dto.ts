import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ParamSlothIdsDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.split(',') : ''))
  @IsUUID(4, { each: true })
  slothIds: string[];
}
