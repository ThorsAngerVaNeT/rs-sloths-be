import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  github: string;

  @IsNotEmpty()
  @IsString()
  avatar_url: string;
}
