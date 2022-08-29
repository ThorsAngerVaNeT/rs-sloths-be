import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateSuggestionRatingDto {
  @IsNotEmpty()
  @IsUUID()
  suggestionId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
