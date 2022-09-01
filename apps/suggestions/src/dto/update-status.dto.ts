import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @IsNotEmpty()
  @IsString()
  status: 'ACCEPTED' | 'DECLINE';
}
