import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class DependenceResponse {
  @Expose()
  @IsString()
  uuid: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsBoolean()
  status: boolean;
}
