import {
  Entity,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { BaseEntity } from '../common/common.entity';
import { KeyObject } from '../common/types/common.type';
import {
  PostEntity,
  CommentEntity,
  PostVoteEntity,
  CommentVoteEntity,
} from 'src/post/post.entity';

enum UserRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
}

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

  @Column({ nullable: true })
  picture: string;
  static pictureField = 'picture';

  @Column({ type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BASIC,
  })
  role: UserRole;

  @Exclude()
  @Column({ type: 'boolean', default: false })
  isStaff: boolean;
  @Exclude()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

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

  @Column({ type: 'timestamptz', default: new Date() })
  lastLogin: Date;

  // Reverse Relation
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => PostVoteEntity, (postVote) => postVote.user)
  postVotes: PostVoteEntity[];

  @OneToMany(() => CommentVoteEntity, (commentVote) => commentVote.user)
  commentVotes: CommentVoteEntity[];

  static async getUser(query: KeyObject) {
    return await this.getRepository().findOne(query);
  }
}
