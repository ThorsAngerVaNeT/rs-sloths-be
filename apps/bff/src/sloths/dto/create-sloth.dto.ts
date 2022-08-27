import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSlothDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  tags: CreateSlothDto[];
}
