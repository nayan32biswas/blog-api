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
@Tree('closure-table')
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

  @TreeChildren()
  children: CommentEntity[];

  @TreeParent()
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

  @OneToMany(() => CommentVoteEntity, (vote) => vote.comment)
  votes: CommentVoteEntity[];
}
