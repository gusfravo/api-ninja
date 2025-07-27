import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependence } from './entity/dependence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dependence])],
})
export class DependenceModule { }
