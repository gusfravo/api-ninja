import { ApiProperty } from '@nestjs/swagger';
import { CreateDelegation } from './create-delegation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDelagation extends CreateDelegation {
  @ApiProperty({ description: 'identifcador de la delgacion' })
  @IsString()
  @IsOptional()
  uuid: string;
}
