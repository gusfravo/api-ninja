import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateBenefit {
  @ApiProperty({ description: 'Nombre de la prestación' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Estatus que describe si la perception esta activa o no',
  })
  @IsBoolean()
  status: boolean;
}
