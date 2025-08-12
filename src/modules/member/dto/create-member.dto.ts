import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateMember {
  @ApiProperty({ description: 'nombre completo del la persona' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'RFC de la persona' })
  @IsString()
  rfc: string;

  @ApiProperty({ description: 'fecha de nacimiento, se obtiene del RFC' })
  @IsDate()
  birthDate: Date;

  @ApiProperty({ description: 'Dep viene en el excel' })
  @IsString()
  department: string;

  @ApiProperty({ description: 'Nom viene en el excel' })
  @IsString()
  nom: string;

  @ApiProperty({ description: 'secretary viene en el excel' })
  @IsString()
  secretary: string;

  @ApiProperty({
    description:
      'Indicador para saber si la persona da aportaciones al sindicado',
  })
  @IsBoolean()
  contribution: boolean;

  @ApiProperty({ description: 'status description' })
  @IsBoolean()
  status: boolean;
}
