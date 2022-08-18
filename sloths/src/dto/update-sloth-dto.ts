import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateSlothDto } from './create-sloth-dto';

export class UpdateSlothDto extends PartialType(CreateSlothDto) {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
