import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
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
