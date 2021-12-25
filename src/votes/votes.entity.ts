import { CommentEntity } from 'src/comments/comments.entity';
import { PostEntity } from 'src/posts/posts.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/common.entity';
import { UserEntity } from 'src/users/users.entity';

export enum VoteType {
  UPVOTE = 'U',
  DOWNVOTE = 'D',
}

@Entity({ name: 'post_vote' })
export class PostVoteEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.postVotes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (comment) => comment.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: PostEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
@Entity({ name: 'comment_vote' })
export class CommentVoteEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.commentVotes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
