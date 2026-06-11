import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEventMember {
  @ApiProperty({ description: 'UUID del EventFile al que pertenece' })
  @IsUUID()
  eventFileId: string;

  @ApiProperty({ description: 'UUID del Member' })
  @IsUUID()
  memberId: string;

  @ApiProperty({ description: 'UUID de la Dependencia' })
  @IsUUID()
  dependenceId: string;

  @ApiProperty({ description: 'Nombre completo del miembro' })
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ description: 'Nombre del hijo', nullable: true })
  @IsString()
  @IsOptional()
  child_name: string;

  @ApiPropertyOptional({ description: 'Nivel escolar', nullable: true })
  @IsString()
  @IsOptional()
  school_level: string;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observations: string;

  @ApiPropertyOptional({ description: 'Aprobado', default: false })
  @IsBoolean()
  @IsOptional()
  approved: boolean;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  status: boolean;
}
