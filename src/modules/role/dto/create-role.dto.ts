import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateRole {
  @ApiProperty({ description: 'Nombre del rol' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del rol' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Estatus del rol' })
  @IsBoolean()
  status: boolean;
}
