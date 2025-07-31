import { ApiProperty } from '@nestjs/swagger';
import { CreateBenefit } from './create-benefit.dto';
import { IsString } from 'class-validator';

export class UpdateBenefit extends CreateBenefit {
  @ApiProperty({ description: 'Benefit`s uuid' })
  @IsString()
  uuid: string;
}
