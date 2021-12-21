import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { TagEntity } from 'src/tags/tags.entity';
import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity, (user) => user.posts, {
    cascade: true,
  })
  user: UserEntity;

  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string;
  static imageField = 'image';

  @Column({ type: 'timestamptz', nullable: true })
  published: Date;

  @Exclude()
  @ManyToMany((type) => TagEntity)
  @JoinTable()
  tags: TagEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  // static getEntityRepository() {
  //   return this.getRepository();
  // }
}

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => PostEntity)
  post: PostEntity;

  @Column()
  content: string;
}
