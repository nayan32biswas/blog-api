import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags: Array<string>;

  @IsOptional()
  @IsDateString()
  published_at: Date;
  @IsOptional()
  @IsBoolean()
  is_published: boolean;
}

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  published_at: Date;
  @IsOptional()
  @IsBoolean()
  is_published: boolean;
}
