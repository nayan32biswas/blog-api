import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column()
  email: string;

  @Column()
  firstName: string;
  @Column()
  lastName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  birthDate: Date;

  @Column()
  isStaff: boolean;
  @Column()
  isAdmin: boolean;
}
