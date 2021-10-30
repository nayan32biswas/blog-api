import { IsObject, IsOptional, IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
}

export class PostUpdateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
}
