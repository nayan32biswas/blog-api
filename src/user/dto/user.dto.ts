import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationDto {
  @IsString()
  role: string;

  @IsEmail()
  email: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsNotEmpty()
  password: string;
}

export class UserUpdateDto {
  @IsString()
  readonly first_name: string;
  @IsString()
  readonly last_name: string;

  @IsString()
  readonly birth_date;
}
