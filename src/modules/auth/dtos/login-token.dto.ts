import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

class RoleDto {
  @ApiProperty({ description: 'uuid del rol' })
  @Expose()
  @IsUUID()
  uuid: string;

  @ApiProperty({ description: 'nombre del rol' })
  @Expose()
  @IsString()
  name: string;
}

export class LoginToken {
  @ApiProperty({ description: 'uuid del usuario logueado' })
  @Expose()
  @IsUUID()
  uuid: string;

  @ApiProperty({ description: 'nombre completo del usuario' })
  @Expose()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'nombre de usuario de la cuenta' })
  @Expose()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Role del usuario' })
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;

  @ApiProperty({ description: 'Token del usuario' })
  @Expose()
  @IsString()
  token: string;

  @ApiProperty({ description: 'tipo de token' })
  @Expose()
  @IsString()
  tokenType: string;
}
