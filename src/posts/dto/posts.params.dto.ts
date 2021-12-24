import { IsString, IsNotEmpty } from 'class-validator';

export class PostDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  slug: string;

  constructor(slug: string) {
    this.slug = slug;
  }
}
