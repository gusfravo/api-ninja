import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterListDelegation {
  @ApiProperty({ description: 'index delagation' })
  @IsOptional()
  @IsString()
  dependenceId: string;

  @ApiProperty({ description: 'Nombre de la delagación' })
  @IsOptional()
  @IsString()
  name: string;
}
