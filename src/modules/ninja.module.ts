import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { DependenceModule } from './dependence/dependence.module';
import { BenefitModule } from './benefit/benefit.module';

@Module({
  imports: [AuthModule, DependenceModule, BenefitModule],
  providers: [],
  exports: [],
})
export class NinjaModule { }
