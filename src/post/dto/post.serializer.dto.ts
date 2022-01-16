import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from 'src/user/dto/user.serializer';
import { TagEntity } from '../post.entity';
import { CommentSerializer } from './comments.serializer.dto';

@Exclude()
export class PostListSerializer {
  @Expose() title: string;
  @Expose() slug: string;
  @Expose() short_content: string;
  @Expose() image: string;
  @Expose() published_at: Date;

  @Expose() numberOfComment: Date;
  @Expose() numberOfVote: Date;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<PostListSerializer>) {
    Object.assign(this, partial);
  }
}

export class PostDetailsSerializer {
  // Export all data
  id: number;
  @Exclude()
  updated_at: Date;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  @Expose()
  @Transform(({ value }) => value.map((tag: TagEntity) => tag.name))
  tags: TagEntity[];

  @Expose()
  comments!: CommentSerializer[];

  constructor(partial: Partial<PostDetailsSerializer>) {
    Object.assign(this, partial);
  }
}
