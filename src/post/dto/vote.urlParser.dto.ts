import { IsString, IsNotEmpty } from 'class-validator';

export class PostVoteDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  @IsString()
  @IsNotEmpty()
  voteId: number;

  constructor(postSlug: string, voteId: string) {
    this.postSlug = postSlug;
    this.voteId = parseInt(voteId);
  }
}

export class CommentVoteDetailsParams {
  // @IsDefined() // cover by IsNotEmpty
  @IsString()
  @IsNotEmpty()
  postSlug: string;

  @IsString()
  @IsNotEmpty()
  commentId: number;

  @IsString()
  @IsNotEmpty()
  voteId: number;

  constructor(postSlug: string, commentId: string, voteId: string) {
    this.postSlug = postSlug;
    this.commentId = parseInt(commentId);
    this.voteId = parseInt(voteId);
  }
}
