import { IsString, IsNotEmpty, IsOptional, IsJSON } from 'class-validator';

export class CreateSlothDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsJSON()
  tags: string;
}
