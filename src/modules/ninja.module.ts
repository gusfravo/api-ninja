import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { DependenceModule } from './dependence/dependence.module';
import { BenefitModule } from './benefit/benefit.module';
import { MemberModule } from './member/member.module';
import { DelegationModule } from './delegation/delegation.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    AuthModule,
    DependenceModule,
    BenefitModule,
    MemberModule,
    DelegationModule,
    EventModule,
  ],
  providers: [],
  exports: [],
})
export class NinjaModule { }
