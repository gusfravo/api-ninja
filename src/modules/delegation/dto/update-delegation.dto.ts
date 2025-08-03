import { ApiProperty } from '@nestjs/swagger';
import { CreateDelegation } from './create-delegation.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateDelagation extends CreateDelegation {
  @ApiProperty({ description: 'identifcador de la delgacion' })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
