import {
  Entity,
  Column,
  ManyToOne,
  TreeChildren,
  TreeParent,
  Tree,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';
import { CommentVoteEntity } from '../votes/votes.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: PostEntity;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.childrens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: CommentEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  // Reverse Relation
  @OneToMany(() => CommentVoteEntity, (vote) => vote.comment)
  votes: CommentVoteEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  childrens: CommentEntity[];
}
