import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { Benefit } from './entity/benefit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
})
export class BenefitModule { }
