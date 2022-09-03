import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  github: string;
}
