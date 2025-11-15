import { CreateEventFile, UpdateEventFile } from '@event/dto';
import { EventFile } from '@event/entity/event-file.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from './event.service';
import { forkJoin, from, of, switchMap, throwError } from 'rxjs';
import { DelegationService } from '@delegation/service/delegation.service';

@Injectable()
export class EventFileService {
  constructor(
    @InjectRepository(EventFile)
    private eventFileRepository: Repository<EventFile>,
    private readonly eventservice: EventService,
    private readonly delegationService: DelegationService,
  ) {}

  findByEvent(eventId: string) {
    return this.eventFileRepository.find({
      where: { event: { uuid: eventId } },
    });
  }

  onUpdate(updateEventFile: UpdateEventFile) {
    const { uuid, ...createDelegation } = updateEventFile;

    if (uuid) return this.update(updateEventFile);

    return this.create(createDelegation);
  }

  private create(creatEventFile: CreateEventFile) {
    const delegation$ = this.delegationService.onGet(
      creatEventFile.delegationId,
    );
    const event$ = this.eventservice.onGet(creatEventFile.eventId);

    return forkJoin({ delegation: delegation$, event: event$ }).pipe(
      switchMap(({ delegation, event }) => {
        const saveEventFile = Object.assign(new EventFile(), {
          ...creatEventFile,
          delegation: delegation,
          event: event,
        });

        return from(this.eventFileRepository.save(saveEventFile));
      }),
    );
  }

  private update(updateEventFile: UpdateEventFile) {
    const delegation$ = this.delegationService.onGet(
      updateEventFile.delegationId,
    );
    const event$ = this.eventservice.onGet(updateEventFile.eventId);

    return this.get(updateEventFile.uuid).pipe(
      switchMap((eventFile) => {
        return forkJoin({
          delegation: delegation$,
          event: event$,
        }).pipe(
          switchMap(({ delegation, event }) => {
            eventFile.deletation = delegation;
            eventFile.event = event;
            return from(this.eventFileRepository.save(eventFile));
          }),
        );
      }),
    );
  }

  private get(eventFileId: string) {
    return from(
      this.eventFileRepository.findOne({
        where: { uuid: eventFileId },
        relations: { event: true, deletation: true },
      }),
    ).pipe(
      switchMap((eventFile) => {
        if (!eventFile)
          return throwError(
            () =>
              new NotFoundException(
                'No pudimos encontrar el eventFile descrita',
              ),
          );
        return of(eventFile);
      }),
    );
  }
}
