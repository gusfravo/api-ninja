import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'username de la cuenta' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;
}
