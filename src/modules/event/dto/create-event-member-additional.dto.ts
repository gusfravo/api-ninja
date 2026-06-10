import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateEventMemberAdditional {
  @ApiProperty({ description: 'UUID del EventMember al que pertenece' })
  @IsUUID()
  eventMemberId: string;

  @ApiProperty({ description: 'Clave del estado adicional' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Valor del estado', default: false })
  @IsBoolean()
  value: boolean;
}
