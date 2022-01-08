export interface UserInterface {
  id: number;

  is_active: boolean;

  createDateTime: Date;
  lastChangedDateTime: Date;

  username: string;
  email: string;

  first_name: string;
  last_name: string;

  birth_date: Date;
}
