import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/common.entity';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity {
  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
}
