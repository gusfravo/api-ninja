import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateEvent } from './create-event.dto';

export class UpdateEvent extends CreateEvent {
  @ApiProperty({ description: 'identifcador del evento' })
  @IsString()
  uuid: string;
}
