import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
  In,
} from 'typeorm';

import { BaseEntity } from '../common/common.entity';
import { UserEntity } from '../user/user.entity';
import { toAlphabet } from '../common/utils/strings';

@Entity({ name: 'tag' })
export class TagEntity extends BaseEntity {
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
  @ManyToOne(() => UserEntity, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column('text')
  content: string;

  @Column({ type: 'text', nullable: true })
  short_content: string;

  @Column({ default: 0 })
  number_of_comment: number;

  @Column({ nullable: true })
  image: string;
  static imageField = 'image';

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date;

  @Column({ default: false })
  is_published: boolean;

  // Reverse Relation
  @Exclude()
  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.posts)
  @JoinTable()
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @OneToMany(() => PostVoteEntity, (vote) => vote.post)
  votes: PostVoteEntity[];
}

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: PostEntity;

  @Column({ nullable: false })
  content: string;

  @Column({ default: 0 })
  number_of_child: number;

  @ManyToOne(() => CommentEntity, (comment) => comment.childrens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: CommentEntity;

  // Reverse Relation
  @OneToMany(() => CommentVoteEntity, (vote) => vote.comment)
  votes: CommentVoteEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  childrens: CommentEntity[];
}

export enum VoteType {
  UPVOTE = 'U',
  DOWNVOTE = 'D',
}

@Entity({ name: 'post_vote' })
export class PostVoteEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.post_votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
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
  @ManyToOne(() => UserEntity, (user) => user.comment_votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.UPVOTE,
  })
  type: VoteType;
}
