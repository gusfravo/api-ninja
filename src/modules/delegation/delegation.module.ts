import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delegation } from './entity/delegation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delegation])],
})
export class DelegationModule { }
