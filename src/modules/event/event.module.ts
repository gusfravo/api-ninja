import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventFile } from './entity/event-file.entity';
import { EventMember } from './entity/event-members.entity';
import { EventMemberAdditionalState } from './entity/event-member-additional.entity';
import { BenefitModule } from '@benefit/benefit.module';
import { EventExcel } from './entity/event-excel.entity';
import { EventController } from './controllers';
import { EventService } from './services/event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventFile,
      EventMember,
      EventMemberAdditionalState,
      EventExcel,
    ]),
    BenefitModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
