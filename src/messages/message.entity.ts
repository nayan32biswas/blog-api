import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'message' })
export class UserEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  sander: UserEntity;

  @ManyToOne((type) => UserEntity)
  receiver: UserEntity;

  @Column()
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
