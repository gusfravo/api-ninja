import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEventFile {
  @ApiProperty({
    description: 'identificador del titular, es parametro es opcional',
  })
  @IsString()
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'Delegacion identificador' })
  @IsUUID()
  delegationId: string;

  @ApiPropertyOptional({ description: 'Nombre de la dependencia', nullable: true })
  @IsString()
  @IsOptional()
  dependence_name?: string | null;

  @ApiPropertyOptional({ description: 'Dependencia identificador', nullable: true })
  @IsUUID()
  @IsOptional()
  dependenceId?: string | null;
}

