import { BadRequestException } from '@nestjs/common';
import { plainToClass, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, ValidateIf } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class CreateSlothDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Transform(({ value }) => {
    try {
      return value
        ? JSON.parse(value)
            .filter((tag: CreateTagDto) => tag.value)
            .map((tag: CreateTagDto) => plainToClass(CreateTagDto, tag))
        : '';
    } catch (error) {
      throw new BadRequestException(['Tags must be JSON']);
    }
  })
  @IsOptional()
  @ValidateIf(({ tags }) => tags !== '')
  @ValidateNested({ each: true })
  tags: CreateTagDto[];
}
