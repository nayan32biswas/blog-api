import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerializer {
  @Expose() email: string;
  @Expose() username: string;
  @Expose() firstName: string;
  @Expose() lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class UserMinimalSerializer {
  @Expose() username: string;
  @Exclude() firstName: string;
  @Exclude() lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  @Expose() picture: string;

  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }
}
