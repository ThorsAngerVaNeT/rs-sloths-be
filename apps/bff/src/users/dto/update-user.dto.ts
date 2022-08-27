import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}
