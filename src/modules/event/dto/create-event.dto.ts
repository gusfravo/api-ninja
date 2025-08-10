import { EventStatus } from '@event/enums/event-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEvent {
  @ApiProperty({ description: 'Estatus used for that event' })
  @IsString()
  status: EventStatus;

  @ApiProperty({ description: 'Fecha de inicio de la prestacion' })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'Fecha de fin del evento' })
  @Type(() => Date)
  @IsOptional()
  endDate: Date | null;

  @ApiProperty({
    description: 'identificador de la prestacion a asociiar con el evento',
  })
  @IsUUID()
  benefitId: string;
}
