import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateEventMember } from './create-event-member.dto';

export class UpdateEventMember extends CreateEventMember {
  @ApiPropertyOptional({ description: 'UUID del EventMember (omitir para crear)' })
  @IsUUID()
  @IsOptional()
  uuid?: string;
}
