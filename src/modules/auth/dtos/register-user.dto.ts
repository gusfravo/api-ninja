import { IsBoolean, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class RegisterUser {
  @IsString()
  username: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  roleName: string;
}
