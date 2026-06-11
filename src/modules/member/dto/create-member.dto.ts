import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMember {
  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsString()
  rfc: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birth_date?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secretary?: string;

  @ApiProperty()
  @IsBoolean()
  contribution: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
