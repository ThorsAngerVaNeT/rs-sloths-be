import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSuggestionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;
}
