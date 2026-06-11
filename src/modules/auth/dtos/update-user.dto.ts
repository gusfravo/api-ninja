import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Identificador del usuario (omitir para crear)' })
  @IsUUID()
  @IsOptional()
  uuid?: string;

  @ApiProperty({ description: 'Username de la cuenta' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Nombre completo' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Contraseña (requerida al crear, opcional al editar)' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Estatus del usuario' })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: 'UUID del rol a asignar' })
  @IsUUID()
  roleId: string;
}
