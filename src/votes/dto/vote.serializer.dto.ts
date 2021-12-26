import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from 'src/users/types/users.serializer';

@Exclude()
export class PostVoteSerializer {
  @Expose() id: number;
  @Expose() type: string;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<PostVoteSerializer>) {
    Object.assign(this, partial);
  }
}
