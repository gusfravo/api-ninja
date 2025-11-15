import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateEventFile {
  @ApiProperty({
    description: 'identificador del titular, es parametro es opcional',
  })
  @IsString()
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'Delegacion identificador' })
  @IsUUID()
  delegationId: string;
}

