import { Exclude } from 'class-transformer';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';

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
}

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @Column()
  content: string;
}
