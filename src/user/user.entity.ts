import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
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
}
