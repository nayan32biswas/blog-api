import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from '../../users/types/users.serializer';

@Exclude()
export class CommentSerializer {
  @Expose() id: number;
  @Expose() content: string;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<CommentSerializer>) {
    Object.assign(this, partial);
  }
}
