import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseUploadEventFile {
  @ApiProperty({
    description: 'El ID único del archivo guardado en la base de datos.',
    example: 'd96c9c69-f8b1-41e5-829d-4340c112d26e',
  })
  @Expose()
  uuid: string;

  @Expose()
  @ApiProperty({
    description: 'El nombre original del archivo.',
    example: 'mi_reporte.xlsx',
  })
  name: string;

  @ApiProperty({
    description: 'El tipo MIME del archivo.',
    example:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'El ID del evento asociado al archivo.',
    example: 'e7a5b3a4-5e0e-4f1b-8c8c-1a3f65d8a9b2',
  })
  @Expose()
  eventId: string;
}
