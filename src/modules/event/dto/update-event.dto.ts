import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateEvent } from './create-event.dto';

export class UpdateEvent extends CreateEvent {
  @ApiProperty({ description: 'identifcador del evento' })
  @IsUUID()
  uuid: string;
}
