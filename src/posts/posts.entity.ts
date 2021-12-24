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

@Entity({ name: 'tag' })
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

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
  @ManyToMany((type) => TagEntity)
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
}

@Entity({ name: 'comment' })
@Tree('closure-table')
export class CommentEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => PostEntity)
  post: PostEntity;

  @Column()
  content: string;

  @TreeChildren()
  children: CommentEntity[];

  @TreeParent()
  parent: CommentEntity;

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
}

export enum VoteType {
  UPVOTE = 'U',
  DOWNVOTE = 'D',
}

@Entity({ name: 'post_vote' })
export class PostVoteEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => PostEntity)
  post: PostEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
@Entity({ name: 'comment_vote' })
export class CommentVoteEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity)
  user: UserEntity;
  @ManyToOne((type) => CommentEntity)
  comment: CommentEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
