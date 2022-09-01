import { IsJSON, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGameResultDto {
  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsJSON()
  result: string;
}
