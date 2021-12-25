import {
  Entity,
  Column,
  ManyToOne,
  TreeChildren,
  TreeParent,
  Tree,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';

@Entity({ name: 'comment' })
@Tree('closure-table')
export class CommentEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => PostEntity)
  post: PostEntity;

  @Column()
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
}
