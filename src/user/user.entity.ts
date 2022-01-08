import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { BaseEntity } from '../common/common.entity';
import { KeyObject } from '../common/types/common.type';
import { MessageEntity, RoomEntity } from '../message/message.entity';
import { ManyToMany, JoinTable } from 'typeorm';
import {
  PostEntity,
  CommentEntity,
  PostVoteEntity,
  CommentVoteEntity,
} from 'src/post/post.entity';

enum UserRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
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
  first_name: string;
  @Column()
  last_name: string;

  @Column({ nullable: true })
  picture: string;
  static pictureField = 'picture';

  @Column({ type: 'timestamptz', nullable: true })
  birth_date: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BASIC,
  })
  role: UserRole;

  @Column({ type: 'timestamptz', default: new Date() })
  last_login: Date;

  // Reverse Relation
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => PostVoteEntity, (postVote) => postVote.user)
  post_votes: PostVoteEntity[];

  @OneToMany(() => CommentVoteEntity, (commentVote) => commentVote.user)
  comment_votes: CommentVoteEntity[];

  @ManyToMany(() => RoomEntity, (room) => room.users)
  @JoinTable()
  rooms: RoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sander)
  senders: MessageEntity[];

  static async getUser(query: KeyObject) {
    return await this.getRepository().findOne(query);
  }
}
