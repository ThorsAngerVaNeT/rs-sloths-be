import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateSuggestionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image_url: string | null;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;
}
