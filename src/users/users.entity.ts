import { Post } from 'src/posts/posts.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;
  @Column()
  lastName: string;

  @Column({ type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column({ type: 'boolean', default: false })
  isStaff: boolean;
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany((type) => Post, (photo) => photo.user)
  posts: Post[];
}
