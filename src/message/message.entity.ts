import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'room' })
export class RoomEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  description: string;

  @Column()
  is_group: boolean;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  creator: UserEntity;

  // Reverse Relation
  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @OneToMany(() => RoomToUserEntity, (roomToUser) => roomToUser.room)
  users: MessageEntity[];
}

enum RoomRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  BASIC = 'BASIC',
}

@Entity({ name: 'room_to_user' })
@Unique('room_user_constraint', ['room', 'user'])
export class RoomToUserEntity extends BaseEntity {
  @ManyToOne(() => RoomEntity, (room) => room.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.room_to_users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  added_by: UserEntity;

  @Column({ default: false })
  accepted: boolean;

  @Column({
    type: 'enum',
    enum: RoomRole,
    default: RoomRole.BASIC,
  })
  role: RoomRole;
}

@Entity({ name: 'message_request' })
@Unique('room_request_receiver_constraint', ['room', 'receiver'])
export class MessageRequestEntity extends BaseEntity {
  @ManyToOne(() => RoomEntity)
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.senders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  receiver: UserEntity;
}

@Entity({ name: 'message' })
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => RoomEntity)
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.senders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  sander: UserEntity;

  @Column()
  content: string;
}
