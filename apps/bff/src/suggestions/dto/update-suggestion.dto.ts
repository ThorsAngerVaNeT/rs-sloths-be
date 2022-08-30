import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { SuggestionStatus } from '../entities/suggestion.entity';

export class UpdateSuggestionDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @IsNotEmpty()
  @IsString()
  status: SuggestionStatus;
}
