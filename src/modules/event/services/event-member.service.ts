import { CreateEventMember, UpdateEventMember } from '@event/dto';
import { EventFile } from '@event/entity/event-file.entity';
import { EventMember } from '@event/entity/event-members.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { forkJoin, from, of, switchMap, throwError } from 'rxjs';
import { MemberService } from '@member/service/member.service';
import { DependenceService } from '@dependence/service/dependence.service';

@Injectable()
export class EventMemberService {
  constructor(
    @InjectRepository(EventMember)
    private readonly eventMemberRepository: Repository<EventMember>,
    @InjectRepository(EventFile)
    private readonly eventFileRepository: Repository<EventFile>,
    private readonly memberService: MemberService,
    private readonly dependenceService: DependenceService,
  ) {}

  findByEventFile(eventFileId: string) {
    return from(
      this.eventMemberRepository.find({
        where: { eventFile: { uuid: eventFileId } },
        relations: { member: true, dependence: true, eventFile: true, additionalStates: true },
      }),
    );
  }

  onGet(uuid: string) {
    return this.get(uuid);
  }

  onUpdate(dto: UpdateEventMember) {
    if (dto.uuid) return this.update(dto as UpdateEventMember & { uuid: string });
    return this.create(dto);
  }

  onDelete(uuid: string) {
    return this.get(uuid).pipe(
      switchMap((member) => from(this.eventMemberRepository.remove(member))),
    );
  }

  private get(uuid: string) {
    return from(
      this.eventMemberRepository.findOne({
        where: { uuid },
        relations: { member: true, dependence: true, eventFile: true },
      }),
    ).pipe(
      switchMap((member) => {
        if (!member)
          return throwError(
            () => new NotFoundException('EventMember no encontrado'),
          );
        return of(member);
      }),
    );
  }

  private getEventFile(eventFileId: string) {
    return from(
      this.eventFileRepository.findOne({ where: { uuid: eventFileId } }),
    ).pipe(
      switchMap((eventFile) => {
        if (!eventFile)
          return throwError(
            () => new NotFoundException('EventFile no encontrado'),
          );
        return of(eventFile);
      }),
    );
  }

  private create(dto: CreateEventMember) {
    const duplicate$ = from(
      this.eventMemberRepository.findOne({
        where: {
          member: { uuid: dto.memberId },
          eventFile: { uuid: dto.eventFileId },
        },
      }),
    ).pipe(
      switchMap((existing) => {
        if (existing)
          return throwError(
            () => new ConflictException('El miembro ya está registrado en este archivo de evento'),
          );
        return of(null);
      }),
    );

    return duplicate$.pipe(
      switchMap(() =>
        forkJoin({
          eventFile: this.getEventFile(dto.eventFileId),
          member: this.memberService.onGet(dto.memberId),
          dependence: this.dependenceService.onGet(dto.dependenceId),
        }),
      ),
      switchMap(({ eventFile, member, dependence }) => {
        const entity = Object.assign(new EventMember(), {
          full_name: dto.full_name,
          child_name: dto.child_name ?? null,
          school_level: dto.school_level ?? null,
          observations: dto.observations ?? '',
          approved: dto.approved ?? false,
          status: dto.status,
          eventFile,
          member,
          dependence,
        });
        return from(this.eventMemberRepository.save(entity));
      }),
    );
  }

  private update(dto: UpdateEventMember & { uuid: string }) {
    return this.get(dto.uuid).pipe(
      switchMap((entity) =>
        forkJoin({
          member: this.memberService.onGet(dto.memberId),
          dependence: this.dependenceService.onGetBruto(dto.dependenceId),
        }).pipe(
          switchMap(({ member, dependence }) => {
            entity.full_name = dto.full_name;
            entity.child_name = dto.child_name;
            entity.school_level = dto.school_level;
            entity.observations = dto.observations ?? entity.observations;
            entity.approved = dto.approved ?? entity.approved;
            entity.status = dto.status;
            entity.member = member;
            entity.dependence = dependence;
            return from(this.eventMemberRepository.save(entity));
          }),
        ),
      ),
    );
  }
}
