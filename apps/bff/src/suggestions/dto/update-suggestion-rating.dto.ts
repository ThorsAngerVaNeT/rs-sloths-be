import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateSuggestionRatingDto {
  @IsNotEmpty()
  @IsUUID(4)
  suggestionId: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
