import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerializer {
  @Expose() email: string;
  @Expose() username: string;
  @Expose() first_name: string;
  @Expose() last_name: string;

  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class UserMinimalSerializer {
  @Expose() username: string;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() picture: string;

  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}
