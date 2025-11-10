import { EventFile } from '@event/entity/event-file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventFileService {
  constructor(
    @InjectRepository(EventFile)
    private eventFileRepository: Repository<EventFile>,
  ) {}

  findByEvent(eventId: string) {
    return this.eventFileRepository.find({
      where: { event: { uuid: eventId } },
    });
  }
}
