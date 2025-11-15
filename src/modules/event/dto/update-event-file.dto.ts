import { ApiProperty } from '@nestjs/swagger';
import { CreateEventFile } from './create-event-file.dto';
import { IsString } from 'class-validator';

export class UpdateEventFile extends CreateEventFile {
  @ApiProperty({ description: 'Indentificado del eventFile' })
  @IsString()
  uuid: string;
}
