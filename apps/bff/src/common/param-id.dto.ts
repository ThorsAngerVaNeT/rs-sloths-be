import { IsNotEmpty, IsUUID } from 'class-validator';

export class ParamIdDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}
