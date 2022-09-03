import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateGameResultDto {
  @IsNotEmpty()
  @IsUUID(4)
  gameId: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  time: number;
}
