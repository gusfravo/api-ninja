import { CreateEventMemberAdditional, UpdateEventMemberAdditional } from '@event/dto';
import { EventMemberAdditionalState } from '@event/entity/event-member-additional.entity';
import { EventMember } from '@event/entity/event-members.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, of, forkJoin, switchMap, throwError } from 'rxjs';

@Injectable()
export class EventMemberAdditionalService {
  constructor(
    @InjectRepository(EventMemberAdditionalState)
    private readonly additionalRepository: Repository<EventMemberAdditionalState>,
    @InjectRepository(EventMember)
    private readonly eventMemberRepository: Repository<EventMember>,
  ) {}

  findByEventMember(eventMemberId: string) {
    return from(
      this.additionalRepository.find({
        where: { eventMember: { uuid: eventMemberId } },
        relations: { eventMember: true },
      }),
    );
  }

  onGet(uuid: string) {
    return this.get(uuid);
  }

  onUpdate(dto: UpdateEventMemberAdditional) {
    if (dto.uuid) return this.update(dto as UpdateEventMemberAdditional & { uuid: string });
    return this.create(dto);
  }

  onDelete(uuid: string) {
    return this.get(uuid).pipe(
      switchMap((state) => from(this.additionalRepository.remove(state))),
    );
  }

  private get(uuid: string) {
    return from(
      this.additionalRepository.findOne({
        where: { uuid },
        relations: { eventMember: true },
      }),
    ).pipe(
      switchMap((state) => {
        if (!state)
          return throwError(
            () => new NotFoundException('EventMemberAdditionalState no encontrado'),
          );
        return of(state);
      }),
    );
  }

  private getEventMember(eventMemberId: string) {
    return from(
      this.eventMemberRepository.findOne({ where: { uuid: eventMemberId } }),
    ).pipe(
      switchMap((eventMember) => {
        if (!eventMember)
          return throwError(
            () => new NotFoundException('EventMember no encontrado'),
          );
        return of(eventMember);
      }),
    );
  }

  private create(dto: CreateEventMemberAdditional) {
    const duplicate$ = from(
      this.additionalRepository.findOne({
        where: {
          key: dto.key,
          eventMember: { uuid: dto.eventMemberId },
        },
      }),
    ).pipe(
      switchMap((existing) => {
        if (existing)
          return throwError(
            () => new ConflictException(`La clave "${dto.key}" ya existe para este miembro`),
          );
        return of(null);
      }),
    );

    return duplicate$.pipe(
      switchMap(() => this.getEventMember(dto.eventMemberId)),
      switchMap((eventMember) => {
        const entity = Object.assign(new EventMemberAdditionalState(), {
          key: dto.key,
          value: dto.value,
          eventMember,
        });
        return from(this.additionalRepository.save(entity));
      }),
    );
  }

  private update(dto: UpdateEventMemberAdditional & { uuid: string }) {
    return this.get(dto.uuid).pipe(
      switchMap((entity) => {
        entity.key = dto.key;
        entity.value = dto.value;
        return from(this.additionalRepository.save(entity));
      }),
    );
  }
}
