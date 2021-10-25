import { Tag } from 'src/tags/tags.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'post' })
export class Post extends BaseEntity {
  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column('text')
  content: string;

  @Column({ type: 'timestamptz', nullable: true })
  published: Date;

  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[];
}

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @ManyToOne((type) => User)
  user: User;
  @Column()
  content: string;
}
