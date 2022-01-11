import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../common/common.entity';
import { KeyObject } from '../common/types/common.type';
import {
  MessageEntity,
  MessageRequestEntity,
  RoomEntity,
  RoomToUserEntity,
} from '../message/message.entity';
import { ManyToMany } from 'typeorm';
import {
  PostEntity,
  CommentEntity,
  PostVoteEntity,
  CommentVoteEntity,
} from 'src/post/post.entity';

export enum UserRole {
  BASIC = 1,
  STAFF = 50,
  ADMIN = 100,
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

  @Column({ type: 'int', default: UserRole.BASIC })
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

  @ManyToMany(() => RoomToUserEntity, (roomToUser) => roomToUser.user)
  room_to_users: RoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sander)
  senders: MessageEntity[];

  @OneToMany(() => MessageRequestEntity, (message) => message.receiver)
  message_requests: MessageRequestEntity[];

  static async getUser(query: KeyObject) {
    return await this.getRepository().findOne(query);
  }
}
