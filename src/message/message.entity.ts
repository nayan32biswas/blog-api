import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'message' })
export class UserEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  sander: UserEntity;

  @ManyToOne(() => UserEntity)
  receiver: UserEntity;

  // @ManyToOne(() => UserEntity, user => user.senders, { nullable: false, onDelete: 'CASCADE' })
  // sander: UserEntity;
  // @ManyToOne(() => UserEntity, user => user.receivers, { nullable: false, onDelete: 'CASCADE' })
  // receiver: UserEntity;

  @Column()
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
