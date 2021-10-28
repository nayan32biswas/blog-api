import { Tag } from 'src/tags/tags.entity';
import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';
import { Exclude } from 'class-transformer';

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

  @Column({ type: 'timestamptz', nullable: true })
  published: Date;

  @Exclude()
  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[];
}

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @Column()
  content: string;
}
