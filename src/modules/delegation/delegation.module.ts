import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delegation } from './entity/delegation.entity';
import { DependenceModule } from '@dependence/dependence.module';
import { MemberModule } from '@member/member.module';
import { DelegationService } from './service/delegation.service';
import { DelegationController } from './controller/delgation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delegation]),
    DependenceModule,
    MemberModule,
  ],
  providers: [DelegationService],
  controllers: [DelegationController],
})
export class DelegationModule { }
