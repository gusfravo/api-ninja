import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { DependenceModule } from './dependence/dependence.module';
import { BenefitModule } from './benefit/benefit.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [AuthModule, DependenceModule, BenefitModule, MemberModule],
  providers: [],
  exports: [],
})
export class NinjaModule { }
