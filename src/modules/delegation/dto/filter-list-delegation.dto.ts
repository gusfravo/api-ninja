import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterListDelegation {
  @ApiProperty({ description: 'index delagation' })
  @IsString()
  dependenceId: string;

  @ApiProperty({ description: 'Nombre de la delagación' })
  @IsString()
  name: string;
}
