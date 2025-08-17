import { EventExcelHistory } from '@event/entity/event-excel-history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventExcelHistoryService {
  constructor(
    @InjectRepository(EventExcelHistory)
    private eventExcelHistoryRepository: Repository<EventExcelHistory>,
  ) {}

  onBuilkInsert(listExcelHistory: EventExcelHistory[]) {
    try {
      return this.eventExcelHistoryRepository.upsert(listExcelHistory, [
        'member',
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}
