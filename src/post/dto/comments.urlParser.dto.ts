import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationQuery } from 'src/common/dto/common.query.dto';

export class CommentDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  @IsString()
  @IsNotEmpty()
  commentId: number;

  constructor(postSlug: string, commentId: string) {
    this.postSlug = postSlug;
    this.commentId = parseInt(commentId);
  }
}

export class CommentListQuery extends PaginationQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  childrenOf: number;
}
