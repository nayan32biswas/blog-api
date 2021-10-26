import { IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
}

export class PostUpdateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
}
