import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProccessEventExcel {
  @ApiProperty({
    description: 'El ID del evento asociado al archivo.',
    example: 'e7a5b3a4-5e0e-4f1b-8c8c-1a3f65d8a9b2',
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'Nombre de la pestaña para leer datos del excel',
  })
  @IsString()
  sheetName: string;
}
