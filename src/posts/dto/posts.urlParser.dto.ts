import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

import { PaginationQuery } from '../../common/dto/common.query.dto';

export class PostDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  constructor(postSlug: string) {
    this.postSlug = postSlug;
  }
}

export class PostListQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  q: string;
  @IsOptional()
  @IsString()
  tag: string;
  @IsOptional()
  @IsString()
  username: string;
}
