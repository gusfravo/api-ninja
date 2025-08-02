import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDependence {
  @ApiProperty({ description: 'nombre de la dependencia de gobierno' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Codigo de la dependencia' })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    description: 'Estatus que indica si esta activa la dependencia',
  })
  @IsBoolean()
  status: boolean;
}
