import { Exclude, Transform, Expose } from 'class-transformer';
import { UserMinimalSerializer } from '../../users/types/users.serializer';

@Exclude()
export class PostListSerializer {
  @Expose() title: string;
  @Expose() content: string;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<PostListSerializer>) {
    Object.assign(this, partial);
  }
}
