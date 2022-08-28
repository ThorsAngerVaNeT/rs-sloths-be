import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuggestionDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
