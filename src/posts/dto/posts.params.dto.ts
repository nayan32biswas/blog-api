import { IsString, IsNotEmpty } from 'class-validator';
export class PostDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  constructor(postSlug: string) {
    this.postSlug = postSlug;
  }
}
