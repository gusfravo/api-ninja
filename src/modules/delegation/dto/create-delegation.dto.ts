import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDelegation {
  @ApiProperty({ description: 'codigo de la delegación' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre de la delagación' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Estatus de la delagación' })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: 'identificador del titular, es parametro es opcional',
  })
  @IsString()
  @IsOptional()
  titularId?: string;

  @ApiProperty({ description: 'Delegacion identificador' })
  @IsUUID()
  dependenceId: string;
}
