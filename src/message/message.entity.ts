import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'message' })
export class RoomEntity extends BaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];
}

@Entity({ name: 'message' })
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.senders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  sander: UserEntity;

  @Column()
  content: string;
}
