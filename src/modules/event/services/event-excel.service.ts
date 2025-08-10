import { ResponseUploadEventFile } from '@event/dto/ResponseUploadFileEvent.dto';
import { EventExcel } from '@event/entity/event-excel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { from, map, of, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class EventExcelService {
  constructor(
    @InjectRepository(EventExcel)
    private eventExcelRepository: Repository<EventExcel>,
  ) { }

  findByEvent(eventId: string) {
    return from(
      this.eventExcelRepository.findOne({
        where: { event: { uuid: eventId } },
      }),
    );
  }

  create({ file, eventId }: { file: Express.Multer.File; eventId: string }) {
    const saveEventExcel: EventExcel = Object.assign(new EventExcel(), {
      excel: file.buffer,
      type: file.mimetype,
      name: file.originalname,
      event: eventId,
    });

    return this.findByEvent(eventId).pipe(
      switchMap((eventExcel) => {
        if (eventExcel) return of(eventExcel);
        return from(this.eventExcelRepository.save(saveEventExcel));
      }),
      map((item) => {
        return plainToInstance(ResponseUploadEventFile, item, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }

  readExcelFromEvent(eventId: string) {
    const eventExcel$ = from(
      this.eventExcelRepository.findOne({
        where: { event: { uuid: eventId } },
      }),
    );

    return eventExcel$.pipe(
      tap((excelDB) => {
        if (!excelDB) console.log('Not file');

        console.log(excelDB?.excel);
      }),
    );
  }
}
