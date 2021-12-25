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
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => PostEntity)
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
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => CommentEntity)
  comment: CommentEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
