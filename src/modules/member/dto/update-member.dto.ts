import { ApiProperty } from '@nestjs/swagger';
import { CreateMember } from './create-member.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMember extends CreateMember {
  @ApiProperty({ description: 'id de la persona' })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
