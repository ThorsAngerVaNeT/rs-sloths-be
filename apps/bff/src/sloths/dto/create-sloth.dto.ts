import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSlothDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
