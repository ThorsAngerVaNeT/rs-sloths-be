import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateSlothRatingDto {
  @IsNotEmpty()
  @IsUUID(4)
  slothId: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
