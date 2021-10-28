import { PostEntity } from 'src/posts/posts.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/common.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  isStaff: boolean;
  @Exclude()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany((type) => PostEntity, (photo) => photo.user)
  posts: PostEntity[];
}
