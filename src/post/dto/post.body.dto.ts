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
  publishedAt: Date;
  @IsOptional()
  @IsBoolean()
  isPublished: boolean;
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
  publishedAt: Date;
  @IsOptional()
  @IsBoolean()
  isPublished: boolean;
}
