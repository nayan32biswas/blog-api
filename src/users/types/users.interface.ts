export interface UserInterface {
  id: number;

  isActive: boolean;

  createDateTime: Date;
  lastChangedDateTime: Date;

  username: string;
  email: string;

  firstName: string;
  lastName: string;

  birthDate: Date;

  isStaff: boolean;
  isAdmin: boolean;
}
