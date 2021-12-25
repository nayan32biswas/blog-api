import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { PaginationQuery } from '../../common/dto/common.query.dto';

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
  @IsNumber()
  childrenOf: number;
}
