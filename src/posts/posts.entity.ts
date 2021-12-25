import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
  TreeChildren,
  TreeParent,
  Tree,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  In,
} from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../users/users.entity';
import { toAlphabet } from '../common/utils/strings';
import { CommentEntity } from 'src/comments/comments.entity';

@Entity({ name: 'tag' })
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Exclude()
  @ManyToMany(() => PostEntity, (post: PostEntity) => post.tags)
  @JoinTable()
  posts: PostEntity[];

  static async createOrGetTags(payloadTags: Array<string>) {
    const tagsRepository = this.getRepository();
    const tags = payloadTags.map((tag: string) => toAlphabet(tag));

    const existingTags = await tagsRepository.find({ name: In(tags) });
    const tempTags = [...existingTags];
    tags.forEach((tag: string) => {
      const exists = existingTags.some(
        (tagData: TagEntity) => tagData.name === tag,
      );
      if (!exists) {
        const newTag = new TagEntity();
        newTag.name = tag;
        newTag.save();
        tempTags.push(newTag);
      }
    });
    return tempTags;
  }
}

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity, (user) => user.posts, {
    cascade: true,
  })
  user: UserEntity;

  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string;
  static imageField = 'image';

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Exclude()
  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.posts)
  @JoinTable()
  tags: TagEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  static getPublished() {
    const queryBuilder = this.getRepository().createQueryBuilder();
    queryBuilder.andWhere(
      `((PostEntity.publishedAt IS NULL AND PostEntity.isPublished = true) OR (PostEntity.publishedAt IS NOT NULL AND PostEntity.publishedAt <= :publishedAt))`,
      { publishedAt: new Date() },
    );
    return queryBuilder;
  }
}
