import { ApiProperty } from '@nestjs/swagger';
import { CreateDependence } from './create-dependence.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDependence extends CreateDependence {
  @ApiProperty({ description: 'Index de la dependencia' })
  @IsString()
  @IsOptional()
  uuid: string;
}
