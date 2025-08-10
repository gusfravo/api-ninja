import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileEventDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Id del evento',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Excel para subir datos al evento',
  })
  file: Express.Multer.File; // if you've installed @types/multer
}
