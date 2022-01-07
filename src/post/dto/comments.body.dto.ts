import { IsInt, IsString, IsOptional } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  parentId: number;
}

export class CommentUpdateDto {
  @IsString()
  content: string;
}
