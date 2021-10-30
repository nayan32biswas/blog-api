import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from '../../users/types/users.serializer';

@Exclude()
export class PostListSerializer {
  @Expose() title: string;
  @Expose() slug: string;
  @Expose() content: string;
  @Expose() image: string;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<PostListSerializer>) {
    Object.assign(this, partial);
  }
}
