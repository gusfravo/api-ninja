import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventFile } from './entity/event-file.entity';
import { EventMember } from './entity/event-members.entity';
import { EventMemberAdditionalState } from './entity/event-member-additional.entity';
import { BenefitModule } from '@benefit/benefit.module';
import { EventExcel } from './entity/event-excel.entity';
import { EventController } from './controllers';
import { EventMemberController } from './controllers/event-member.controller';
import { EventService } from './services/event.service';
import {
  EventExcelHistoryService,
  EventExcelService,
  EventFileService,
} from './services';
import { EventMemberService } from './services/event-member.service';
import { MemberModule } from '@member/member.module';
import { EventExcelHistory } from './entity/event-excel-history.entity';
import { EventExcelController } from './controllers/event-excel.controller';
import { DelegationModule } from '@delegation/delegation.module';
import { DependenceModule } from '@dependence/dependence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventFile,
      EventMember,
      EventMemberAdditionalState,
      EventExcel,
      EventExcelHistory,
    ]),
    BenefitModule,
    MemberModule,
    DelegationModule,
    DependenceModule
  ],
  controllers: [EventController, EventExcelController, EventMemberController],
  providers: [
    EventService,
    EventExcelService,
    EventExcelHistoryService,
    EventFileService,
    EventMemberService
  ],
})
export class EventModule { }
