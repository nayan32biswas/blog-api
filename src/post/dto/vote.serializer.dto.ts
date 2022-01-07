import { Exclude, Transform, Expose } from 'class-transformer';

import { UserMinimalSerializer } from 'src/user/dto/user.serializer';

@Exclude()
export class CommonVoteSerializer {
  @Expose() id: number;
  @Expose() type: string;

  @Expose()
  @Transform(({ value }) => new UserMinimalSerializer(value))
  user: UserMinimalSerializer;

  constructor(partial: Partial<CommonVoteSerializer>) {
    Object.assign(this, partial);
  }
}
