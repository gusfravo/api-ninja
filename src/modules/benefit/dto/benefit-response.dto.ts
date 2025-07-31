import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class BenefitResponse {
  @Expose()
  @IsString()
  uuid: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsBoolean()
  status: true;
}
