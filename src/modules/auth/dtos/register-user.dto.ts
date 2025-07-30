import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class RegisterUser {
  @ApiProperty({ description: 'username de la cuenta' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsStrongPassword()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Nombre completo de la cuenta de usuario' })
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: 'Nombre del rol a asignar a la cuenta' })
  @IsString()
  roleName: string;
}
