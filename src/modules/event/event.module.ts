import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventFile } from './entity/event-file.entity';
import { EventMember } from './entity/event-members.entity';
import { EventMemberAdditionalState } from './entity/event-member-additional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventFile,
      EventMember,
      EventMemberAdditionalState,
    ]),
  ],
})
export class EventModule { }
