import { IsArray, IsOptional, IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: Array<string>;
}

export class PostUpdateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
}
