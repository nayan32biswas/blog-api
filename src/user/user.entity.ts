import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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

  @Column()
  age: number;

  @Column()
  is_active: boolean;
  @Column()
  is_staff: boolean;
  @Column()
  is_admin: boolean;
}
