import { IsString, IsNotEmpty } from 'class-validator';
import { TagsValueList } from 'src/app.interfaces';

export class CreateSlothDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  tags: TagsValueList;
}
