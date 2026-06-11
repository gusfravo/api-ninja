import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Identificador del rol (omitir para crear)' })
  @IsString()
  @IsOptional()
  uuid?: string;

  @ApiProperty({ description: 'Nombre del rol' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Estatus del rol' })
  @IsBoolean()
  status: boolean;
}
