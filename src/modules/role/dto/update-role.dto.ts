import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateRole } from './create-role.dto';

export class UpdateRole extends CreateRole {
  @ApiProperty({ description: 'Identificador del rol' })
  @IsString()
  @IsOptional()
  uuid?: string;
}
