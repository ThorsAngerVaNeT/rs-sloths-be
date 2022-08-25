import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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
