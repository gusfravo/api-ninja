import { EventStatus } from '@event/enums/event-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEvent {
  @ApiProperty({ description: 'Estatus used for that event' })
  @IsString()
  status: EventStatus;

  @ApiProperty({ description: 'Fecha de inicio de la prestacion' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'FEcha de fin del evento' })
  @IsDate()
  @IsOptional()
  endDate: Date | null;

  @ApiProperty({
    description: 'identificador de la prestacion a asociiar con el evento',
  })
  @IsUUID()
  benefitId: string;
}
