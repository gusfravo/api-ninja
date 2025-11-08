import { BenefitService } from '@benefit/service/benefit.service';
import { CreateEvent } from '@event/dto/create-event.dto';
import { UpdateEvent } from '@event/dto/update-event.dto';
import { Event } from '@event/entity/event.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private benefitService: BenefitService,
  ) {}

  onUpdate(updateEvent: UpdateEvent) {
    const { uuid, ...createEvent } = updateEvent;

    if (uuid) return this.update(updateEvent);

    return this.create(createEvent);
  }

  private create(createEvent: CreateEvent) {
    const benefit$ = this.benefitService.get(createEvent.benefitId);

    return benefit$.pipe(
      switchMap((benefit) => {
        const saveEvent: Event = {
          ...structuredClone(new Event()),
          start_date: createEvent.startDate,
          end_date: createEvent.endDate,
          benefit,
          status: createEvent.status,
        };

        return from(this.eventRepository.save(saveEvent));
      }),
    );
  }

  private update(updateEvent: UpdateEvent) {
    const benefit$ = this.benefitService.get(updateEvent.benefitId);

    return this.get(updateEvent.uuid).pipe(
      switchMap((event) => {
        event.end_date = updateEvent.endDate ? updateEvent.endDate : null;
        event.start_date = updateEvent.startDate;
        event.status = updateEvent.status;

        return benefit$.pipe(
          switchMap((benefit) => {
            event.benefit = benefit;
            return from(this.eventRepository.save(event));
          }),
        );
      }),
    );
  }

  onGet(eventId: string) {
    return this.get(eventId);
  }

  private get(eventId: string): Observable<Event> {
    return from(
      this.eventRepository.findOne({
        where: { uuid: eventId },
        relations: {
          benefit: true,
        },
      }),
    ).pipe(
      switchMap((event) => {
        if (!event)
          return throwError(
            () => new NotFoundException('No encontramos el recurso'),
          );

        return of(event);
      }),
    );
  }

  onList(): Observable<Event[]> {
    return from(this.eventRepository.find({ relations: { benefit: true } }));
  }
}
