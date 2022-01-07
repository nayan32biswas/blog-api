import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationDto {
  @IsString()
  role: string;

  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsNotEmpty()
  password: string;
}

export class UserUpdateDto {
  @IsString()
  readonly firstName: string;
  @IsString()
  readonly lastName: string;

  @IsString()
  readonly birthDate;
}
