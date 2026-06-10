import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateEventMemberAdditional } from './create-event-member-additional.dto';

export class UpdateEventMemberAdditional extends CreateEventMemberAdditional {
  @ApiPropertyOptional({ description: 'UUID del registro (omitir para crear)' })
  @IsUUID()
  @IsOptional()
  uuid?: string;
}
