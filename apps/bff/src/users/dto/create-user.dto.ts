import { IsNotEmpty, IsString } from 'class-validator';
import { ROLE } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  github: string;

  @IsNotEmpty()
  @IsString()
  role: ROLE;
}
