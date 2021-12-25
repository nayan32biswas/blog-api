import { IsString } from 'class-validator';

export class CommentCreateUpdateDto {
  @IsString()
  content: string;
}
