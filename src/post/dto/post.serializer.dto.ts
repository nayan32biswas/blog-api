import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from 'src/user/dto/user.serializer';
import { TagEntity } from '../post.entity';

@Exclude()
export class PostListSerializer {
  @Expose() title: string;
  @Expose() slug: string;
  @Expose() content: string;
  @Expose() image: string;
  @Expose() publishedAt: Date;

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
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  @Expose()
  @Transform(({ value }) => value.map((tag: TagEntity) => tag.name))
  tags: TagEntity[];

  constructor(partial: Partial<PostDetailsSerializer>) {
    Object.assign(this, partial);
  }
}
