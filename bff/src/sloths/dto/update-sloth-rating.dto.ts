import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateSlothRatingDto {
  @IsNotEmpty()
  @IsUUID()
  slothId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
