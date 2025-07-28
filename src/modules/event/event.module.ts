import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventFile } from './entity/event-file.entity';
import { EventMember } from './entity/event-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventFile, EventMember])],
})
export class EventModule { }
